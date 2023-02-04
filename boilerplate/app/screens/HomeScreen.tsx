import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View,  useWindowDimensions, Pressable, ViewStyle} from "react-native"
import {
  Button, Icon, // @demo remove-current-line
  Text,
  TextField
} from "../components"
import { isRTL } from "../i18n"
import { useStores } from "../models" // @demo remove-current-line
import { AppStackScreenProps } from "../navigators" // @demo remove-current-line
import { colors, spacing ,typography} from "../theme"
import { useHeader } from "../utils/useHeader" // @demo remove-current-line
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import {PersonList} from "./Home/PersonList"


const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")

interface HomeScreenProps extends AppStackScreenProps<"Welcome"> { } // @demo remove-current-line
const $customButtonTextStyle: TextStyle = {
  color: colors.error,
  fontFamily: typography.primary.bold,
  textDecorationLine: "underline",
  textDecorationColor: colors.error,
  fontSize: 14,
  paddingVertical: 0
}

const $customButtonStyle: ViewStyle = {
paddingVertical: 0,margin: 0 ,minHeight: 26, marginRight: 10}


export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen(
  _props, // @demo remove-current-line
) {
  // @demo remove-block-start
  const { navigation } = _props
  const {
    authenticationStore: { logout, csvData },
  } = useStores()
  useEffect(() => {
    //console.log("csv data is -----", csvData)
  }, [])
  function goNext() {
    navigation.navigate("HomeScreen")
  }
  const { width} = useWindowDimensions();
  const [inputText,setInputText] = useState<string>('');
  const search = () => {
   
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: "center", 
      marginHorizontal: 10,
     
      }}>
     
       
       <TextField
        label=""
        helper=""
        onChangeText={(text)=>{
          setInputText(text)
          console.log(text);
        }}
       
   placeholder={"Search here "}
        //value={inputText}
        containerStyle={{width: width-100}}
        inputWrapperStyle={{paddingLeft: 10, justifyContent: 'center', alignItems: 'center'}}
        LeftAccessory={()=>  <Icon containerStyle={{}} icon={"search"} size={20} /> }
         RightAccessory={()=> <Button
          onPress={()=>{
          
          }} 
          preset="filled"
         style={$customButtonStyle}
         //textStyle={$customButtonTextStyle}
         >
          
          Search</Button>}
      />
      </View>

    )

  }



  useHeader({
    //rightTx: "common.logOut",

   // onRightPress: logout,
    LeftActionComponent: search(),
    //<Icon key={1} icon="ladybug" color={colors.palette.neutral100} size={100} />
    RightActionComponent: <Text size="sm">Saving...</Text>
    
    // LeftActionComponent= {
    //   <Icon icon={"search"}/>
    // }
    //,
  })
  // @demo remove-block-end

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <View style={$container}>

    <PersonList
    inputText={inputText}
    />

    </View>
  )
})

const $container: ViewStyle = {
  paddingTop: 16, 
  flex: 1,
  backgroundColor: colors.background,
}
const $topContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.large,
}

const $bottomContainer: ViewStyle = {
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.large,
  justifyContent: "space-around",
}
const $welcomeLogo: ImageStyle = {
  height: 88,
  width: "100%",
  marginBottom: spacing.huge,
}

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: TextStyle = {
  marginBottom: spacing.medium,
}
