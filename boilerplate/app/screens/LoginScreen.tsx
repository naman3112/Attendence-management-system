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
var options = { year: "numeric", month: "long", day: "numeric" }

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
      getCsvData,
      getDataExport,
      dataDisp,
      dataToBeDisplay
    },
  } = useStores()

  useEffect(() => {
    // Here is where you could fetch credientials from keychain or storage
    // and pre-fill the form fields.
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")
  }, [authToken,csvData])

  const errors: typeof validationErrors = isSubmitted ? validationErrors : ({} as any)

  const uploadFolder = async()=>{
       try{
        const result = await DocumentPicker.getDocumentAsync({type: ["text/comma-separated-values", "text/csv"]});
                if(result?.uri){
                  const s =   await FileSystem.readAsStringAsync(result?.uri)
                  const results = await readString(s,{
                    header: true
                  });
                  setCsvData(results.data)
                  setAuthToken(String(Date.now()))
                }
      
   
       }
       catch(e){
        console.log("error is ", e)
       }
   

  }
  useEffect(()=>{
 getCsvData();
 getDataExport();
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

const $tapButton: ViewStyle = {
  marginTop: spacing.extraSmall,
}

// @demo remove-file
