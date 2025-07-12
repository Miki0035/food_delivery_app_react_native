import { CreateUserPrams, GetMenuParams, SignInParams } from "@/type"
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite"

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.mikiyas.fooddeliveryapp",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: '687153bc0014dbe2fdf0',
    userCollectionId: '687153f8002f351db633',
    categoryCollectionId: '6872a20f000d4584ffe2',
    menuCollectionId: '6872a2990002901f1024',
    customizationCollectionId: '6872a3d700243a4c8ed1',
    menuCustomizationCollectionId: '6872a4bc001f22afe9a9',
    bucketId: '6872a5e4001da38cd8e8'
}

// client connect to appwrite 
export const client = new Client()
client.setEndpoint(appwriteConfig.endpoint!)
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform)

// Appwrite account
export const account = new Account(client)
// Appwrite client databases
export const databases = new Databases(client)
// Appwrite avatars
export const avatars = new Avatars(client)

// Appwrite Storage or bucket
export const storage = new Storage(client)

// sign up
export const createUser = async ({ email, name, password }: CreateUserPrams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password)
        if (!newAccount) throw Error;

        // auth sign in
        await signIn({ email, password })

        // generate avatar image using user's name
        const avatarUrl = avatars.getInitialsURL(name)

        // create db user
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                name,
                avatar: avatarUrl
            }
        )

        return newUser

    } catch (error) {
        throw new Error(error as string)
    }

}


// sign in (creates session for sign in user)
export const signIn = async ({ email, password }: SignInParams) => {
    try {
        // create session 
        const session = await account.createEmailPasswordSession(email, password)
    } catch (error) {
        throw new Error(error as string)
    }
}


export const getCurrentUser = async () => {
    try {
        // gets user from session created when signin
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if (!currentUser) throw Error
        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error as string)
    }
}


export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];
        if (category) queries.push(Query.equal('categories', category))
        if (query) queries.push(Query.equal('name', query))

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        )
        return menus.documents

    } catch (error) {
        throw new Error(error as string)
    }
}


export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoryCollectionId,
        )
    } catch (error) {
        throw new Error(error as string)
    }
}