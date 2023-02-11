import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, View,  useWindowDimensions, 
  Platform,
  Pressable, ViewStyle, Alert} from "react-native"
import {
  Button, Icon, // @demo remove-current-line
  Text,
  TextField
} from "../components"
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
    authenticationStore: { logout, csvData , getDataExport,dataToBeDisplay, setChooseDate,dataDisp},
  } = useStores()
  useEffect(()=>{
    getDataExport();
  },[])

  function goNext() {
    navigation.navigate("HomeScreen")
  }

  const { width} = useWindowDimensions();
  const [inputText,setInputText] = useState<string>('');
  const search = () => {
   
    return (
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: "center", 
      marginLeft: 6,
     
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
    LeftActionComponent: search(),
    //<Icon key={1} icon="ladybug" color={colors.palette.neutral100} size={100} />
    
    
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
  // const newUpdateDateData = csvData.map((item)=>{
  //     item[`${dateString}`]  = null;
  //       return item;
  //   })
  setChooseDate(dateString);
// dataToBeDisplay(newUpdateDateData, dateString);

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
    setDate(currentDate);

    const dateString = currentDate.toLocaleDateString("en-US", options)
    // const newUpdateDateData = csvData.map((item)=>{
    //     item[`${dateString}`]  = null;
    //       return item;
    //   })
      setChooseDate(dateString)
//dataToBeDisplay(newUpdateDateData, dateString);
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
    showMode('date');
  };


  return (
    <View style={$container}>
      <View style={{ flexDirection: 'row'}}>
      <Button
         onPress={showDatepicker}
          preset="filled"
         style={[$customButtonStyle,{width: "40%", marginLeft: 8, marginBottom: 4}]}
         //textStyle={$customButtonTextStyle}
         >Choose Date</Button>
      <Text>{date.toLocaleDateString("en-US", options)}</Text>
      </View>
      <View style={{ flexDirection: 'row'}}>
      <Button
         onPress={()=>{
          navigation.navigate("Welcome")
         }}
          preset="filled"
         style={[$customButtonStyle,{width: "40%", marginLeft: 8, marginBottom: 4}]}
         //textStyle={$customButtonTextStyle}
         >Go to fields</Button>
           {/* <Button
         onPress={showDatepicker}
         disabled={true}
          preset="filled"
         style={[$customButtonStyle,{width: "40%", marginLeft: 8, marginBottom: 4}]}
         //textStyle={$customButtonTextStyle}
         >Filter</Button> */}
      </View>
    
    <PersonList
    date={date}
    inputText={inputText}
    />
<View style={{}}>
<Button
         onPress={async()=>{
          const results = jsonToCSV(dataDisp);
         
          try{
            await saveFile(results)
          }catch(e){
            console.log("---------------",e)
          }
          
         }}
          preset="filled"
         style={{width: "100%", backgroundColor: 'darkred'}}
         textStyle={{color: 'white', fontSize:  20, fontWeight: 'bold'}}
         > Share Via What'sApp </Button>
</View>
    </View>
  )
})

const $container: ViewStyle = {
  paddingVertical: 4, 
  flex: 1,
  backgroundColor: colors.background,
}
