import seed from '@/lib/seed'
import React from 'react'
import { Button, SafeAreaView, Text } from 'react-native'

const Search = () => {
  return (
    <SafeAreaView>
      <Text className='mb-24'>Search</Text>
      <Button title='Seed' onPress={() => seed().catch((error) => console.log('Faild seed', error))} ></Button>
    </SafeAreaView>
  )
}

export default Search