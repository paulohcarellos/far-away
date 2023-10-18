import { useState } from 'react'
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text, Input } from '@ui-kitten/components';


export default () => {
  const [password, setPassword] = useState('');
  const [hidden, setHidden] = useState(true);

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Input
          style={{ paddingBottom: '16px' }}
          label='Email'
          placeholder='Email address'
        />
        <Input
          label='Password'
          placeholder='Password'
          secureTextEntry={hidden}
        />
      </Layout>
    </ApplicationProvider>
  )
};