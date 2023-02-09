import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View,  useWindowDimensions, 
  Platform,
  Pressable, ViewStyle} from "react-native"
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
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { jsonToCSV } from 'react-native-csv'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const welcomeLogo = require("../../assets/images/logo.png")
const welcomeFace = require("../../assets/images/welcome-face.png")
var options = {  year: 'numeric', month: 'long', day: 'numeric' };

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
    authenticationStore: { logout, csvData , dataToBeDisplay, setChooseDate,dataDisp},
  } = useStores()
  useEffect(() => {
    
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
         style={[$customButtonStyle,{}]}
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
  const [date, setDate] = useState(new Date());

useEffect(()=>{


  const dateString = new Date().toLocaleDateString("en-US", options)
  const newUpdateDateData = csvData.map((item)=>{
      item[`${dateString}`]  = null;
        return item;
    })
dataToBeDisplay(newUpdateDateData, dateString);

},[])
  
const saveFile = async (data) => {

  let directoryUri = FileSystem.documentDirectory;
  console.log("docu", directoryUri)
  let fileUri =directoryUri + "workUpload.csv";
  console.log("file uri ", fileUri)
  await FileSystem.writeAsStringAsync(fileUri, data, { encoding: FileSystem.EncodingType.UTF8 });
  console.log("jei")
  shareFile(fileUri);
  return fileUri;
  };
  
  const shareFile = async (fileUri) => {
  const canShare = await Sharing.isAvailableAsync();
  
  // Check if permission granted
  if (canShare) {
    try{
      const res = await Sharing.shareAsync(fileUri);
      console.log('shareAsync', res);
      return true;
    } catch {
      return false;
    }
  } else {
    alert("Você precisa dar permissão para Compartilhar.")
  }};
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log("Current date is ", currentDate)
    setDate(currentDate);

    const dateString = currentDate.toLocaleDateString("en-US", options)
    const newUpdateDateData = csvData.map((item)=>{
        item[`${dateString}`]  = null;
          return item;
      })
dataToBeDisplay(newUpdateDateData, dateString);
  };
  

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    console.log("date is ", date)
    console.log("date curre", new Date());
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View style={$container}>
      <View style={{ flexDirection: 'row'}}>
      <Button
         onPress={showDatepicker}
          preset="filled"
         style={[$customButtonStyle,{width: "50%",}]}
         //textStyle={$customButtonTextStyle}
         > Choose Date</Button>
      <Text>{date.toLocaleDateString("en-US", options)}</Text>
      </View>

    <PersonList
    date={date}
    inputText={inputText}
    />
<View style={{}}>
<Button
         onPress={async()=>{
          const results = jsonToCSV(dataDisp);
          //console.log("Resutls are ", results);
          try{
            await saveFile(results)
          }catch(e){
            console.log("---------------",e)
          }
          
         }}
          preset="filled"
         style={{width: "100%",}}
         //textStyle={$customButtonTextStyle}
         > Export </Button>
</View>
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
