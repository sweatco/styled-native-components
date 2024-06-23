/* picked from https://github.com/efstathiosntonas/react-native-style-libraries-benchmark/blob/main/components/TimedRender.js
 */

import { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'

function TimedRender(props: React.PropsWithChildren) {
  const [start] = useState(Date.now())
  const [end, setEnd] = useState(0)

  useLayoutEffect(() => {
    setEnd(Date.now())
  }, [])

  return (
    <>
      {!!end && <Text style={styles.text}>Took {end - start}ms</Text>}
      {props.children}
    </>
  )
}

const styles = StyleSheet.create({
  text: { color: 'green', marginTop: 12, fontSize: 18 },
})

export default TimedRender
