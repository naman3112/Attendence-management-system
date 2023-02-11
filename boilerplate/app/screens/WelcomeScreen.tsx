import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef } from "react"
import { Alert, Image, ImageStyle, ScrollView, TextStyle, View, ViewStyle } from "react-native"
import {
  Button, // @demo remove-current-line
  Text,
} from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models" // @demo remove-current-line
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { colors, spacing } from "../theme"
import { useHeader } from "../utils/useHeader" // @demo remove-current-line
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { Header } from "../components"
import {  Toggle, ToggleProps } from "../components"



const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {} // @demo remove-current-line


function ControlledToggle(props: any) {
  const [value, setValue] = React.useState(props.value || false)
  return <Toggle {...props} value={value} 
  onValueChange={(event)=>{
    if(event){
      props?.handleCheckBox(props.label,'+');
    }else{
      props?.handleCheckBox(props.label,'-');
    }
  }}
  onPress={() => {
   
    setValue(!value);
  }

   
  
  } />
}
export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(
  _props, // @demo remove-current-line
) {
  // @demo remove-block-start
  const selectedFieldsCheckBox = useRef([]);
  const { navigation } = _props
  const {
    authenticationStore: { logout, csvData,dataToBeDisplay,dataDisp ,setSelectedFields, getSelectedFields, selectedFields},
  } = useStores()

  useEffect(()=>{
   getSelectedFields();
   if(!dataDisp || dataDisp.length==0){
    console.log("loginscreen ", dataDisp)
      dataToBeDisplay(csvData);
   }
   if(Array.isArray(selectedFields) && selectedFields.length>0){
    navigation.navigate("Home")
   }

  },[])
  function goNext() {
    const val = selectedFieldsCheckBox.current
    setSelectedFields(val, true);
   console.log("selected fields er",selectedFields)
    navigation.navigate("Home")
  }
  const showAlert = () =>
  Alert.alert(
    'Are you sure you want to log out?',
    'Log out would delete all your present data related to attendence and you have to start again by uploading attendence file',
    [
      {
        text: `Don't delete`,
        onPress: () => {return },
        style: 'cancel',
      },
      {
        text: 'Yes Delete it',
        onPress: () => logout(),
        style: 'destructive',
      },
    ],
    {
      cancelable: true,
     
    },
  );
  useHeader({
    rightTx: "common.logOut",
    onRightPress: showAlert,
  })
  // @demo remove-block-end

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
 const handleCheckBox = (value, operation = '+')=>{
  if(operation=='+'){
    
    selectedFieldsCheckBox.current.push(value);
    console.log("addition", selectedFieldsCheckBox.current)
      }else{
        const index =   selectedFieldsCheckBox.current.indexOf(value);
        if(index>-1)
        selectedFieldsCheckBox.current.splice(index, 1);
        console.log("selectedFieldsCheckBox.current.splice(index, 1);", selectedFieldsCheckBox.current)
      }
      //setSelectedFields(value)
      
 }
  return (
    <View style={$container}>
       <Text preset="bold" style={{  paddingHorizontal: spacing.large}}>
        Please choose any 5 fields that you want to see/search on the card
      </Text>
      <ScrollView contentContainerStyle={$topContainer}>
        <View >
        {
        Object.keys(csvData?.[0]).map((key)=>{
        
          return(
           <ControlledToggle
              variant="checkbox"
              label={key}
              key={key}
              containerStyle={{marginVertical: 4}}
              handleCheckBox={handleCheckBox}
            
          />     
          )
        })
       }
        </View>
       
      
     
      </ScrollView>

      <View style={[$bottomContainer, $bottomContainerInsets]}>
    
        {/* @demo remove-block-start */}
        <Button
          testID="next-screen-button"
          preset="reversed"
         
          onPress={goNext}
        >Save & Go</Button>
        {/* @demo remove-block-end */}
      </View>
      
    </View>
  )
})
const $centeredOneThirdCol: ViewStyle = {
  width: "33.33333%",
  alignItems: "center",
  justifyContent: "center",
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}

const $topContainer: ViewStyle = {
  //flexShrink: 1,
  flexGrow: 1,
  //flexBasis: "57%",
  justifyContent: "center",
  padding: spacing.large,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "20%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
}

