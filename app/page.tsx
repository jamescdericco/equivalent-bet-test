'use client'

import EquivalentBetTest from './equivalent_bet_test'
import { Link, Text } from '@chakra-ui/react'

export default function Home() {
  return (
    <main>
      <div style={{
        margin: 'auto', maxWidth: '1000px', textAlign: 'center',
        borderRadius: '10px', padding: '10px'
      }}>
        <EquivalentBetTest />
        <Text fontSize="xs" color="gray.500" mt={8} opacity={0.6}>
          <Link href="https://github.com/jamescdericco/equivalent-bet-test" isExternal>
            Source
          </Link>
        </Text>
      </div>
    </main>
  )
}
