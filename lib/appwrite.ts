import { CreateUserPrams, SignInParams } from "@/type"
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite"

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.mikiyas.fooddeliveryapp",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: '687153bc0014dbe2fdf0',
    userCollectionId: '687153f8002f351db633'
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
export const avatars = new Avatars(client)


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


