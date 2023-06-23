'use client'

import EquivalentBetTest from './equivalent_bet_test'

export default function Home() {
  return (
    <main>
      <div style={{
        margin: 'auto', maxWidth: '1000px', textAlign: 'center',
        borderRadius: '10px', padding: '10px'
      }}>
        <EquivalentBetTest />
      </div>
    </main>
  )
}
