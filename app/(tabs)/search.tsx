import { getCategories, getMenu } from '@/lib/appwrite'
import seed from '@/lib/seed'
import useAppwrite from '@/lib/useAppwrite'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Button, SafeAreaView, Text } from 'react-native'

const Search = () => {

  const params = useLocalSearchParams<{ query?: string; category?: string }>()

  const { data, refetch } = useAppwrite({
    fn: getMenu,
    params: { category: '', query: '', limit: 6 }
  })

  const { data: categories } = useAppwrite({
    fn: getCategories,
  })
  return (
    <SafeAreaView>
      <Text className='mb-24'>Search</Text>
      <Button title='Seed' onPress={() => {
        console.log(`Button pressed`)
        seed().catch((error) => console.log('Faild seed', error))
      }}></Button>

    </SafeAreaView>
  )
}

export default Search