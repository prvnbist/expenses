import { useState } from 'react'
import { useRouter } from 'next/router'

import { useSessionStorage } from '@mantine/hooks'
import { Button, Container, Flex, PasswordInput, Space, Title, useMantineTheme } from '@mantine/core'

export default function Login() {
   const router = useRouter()
   const theme = useMantineTheme()
   const [error, setError] = useState('')
   const [password, setPassword] = useState('')
   const [, setValue] = useSessionStorage({ key: 'password', defaultValue: '' })

   const onSubmit = () => {
      if (process.env.APP_PASSWORD === password.trim()) {
         setValue(password.trim())
         return router.push('/')
      }

      setError('Enter the correct password')
   }

   return (
      <Container p={24}>
         <Flex maw={420} mx="auto" p={40} bg={theme.colors.dark[8]} direction="column" sx={{ borderRadius: 8 }}>
            <Title order={3} transform="uppercase" align="center">
               Login
            </Title>
            <Space h={24} />
            <PasswordInput
               radius="md"
               error={error}
               label="Password"
               value={password}
               placeholder="Enter the password"
               onChange={e => setPassword(e.target.value)}
            />
            <Space h={16} />
            <Button color="teal" radius="md" onClick={onSubmit}>
               Submit
            </Button>
         </Flex>
      </Container>
   )
}
