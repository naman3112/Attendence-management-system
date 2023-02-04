import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { readString } from 'react-native-csv';


interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {

  const authPasswordInput = useRef<TextInput>()
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: {
      authEmail,
      authPassword,
      setAuthEmail,
      setAuthPassword,
      setAuthToken,
      validationErrors,
      setCsvData, 
      csvData,
      authToken,
      getCsvData
    },
  } = useStores()

  useEffect(() => {
    console.log('ste authoken ', authToken, "csv datssis", csvData)
    // Here is where you could fetch credientials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")
  }, [authToken,csvData])

  const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

  const uploadFolder = async()=>{
    console.log("i am preessed ")
	   const result = await DocumentPicker.getDocumentAsync({});
      //alert(result?.uri);
    const s =   await FileSystem.readAsStringAsync(result?.uri)
    //console.log("s is ",s) 
    const results = await readString(s,{
      header: true

    });
		 setCsvData(results.data)
     setAuthToken(String(Date.now()))
      console.log("end ", "-----", csvData, authToken);

  }
  useEffect(()=>{
 getCsvData();
console.log("i am here shitty ---", csvData)
  },[])
  function login() {


    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (Object.values(validationErrors).some((v) => !!v)) return

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
    setAuthPassword("")
    setAuthEmail("")

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  useEffect(() => {
    console.log("hey dude checkig the normal value of ", csvData)
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    
    }
  }, [csvData])

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading"  text="Attendence Management System" preset="heading" style={$signIn} />


      {/* <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={errors?.authEmail}
        status={errors?.authEmail ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      /> */}

     

      <Button
        testID="login-button"
        text="Upload file (csv format)"
        style={$tapButton}
        preset="reversed"
        onPress={uploadFolder}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.huge,
  paddingHorizontal: spacing.large,
}

const $signIn: TextStyle = {
  marginBottom: spacing.small,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.large,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.medium,
}

const $textField: ViewStyle = {
  marginBottom: spacing.large,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
}

// @demo remove-file
