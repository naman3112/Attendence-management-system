import React, { ReactNode, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, FlatList, Text } from "react-native"
import { Card, Button } from "../../components"
// import { Text } from "../../components"
import { colors } from "../../theme"
//import { colors, spacing, typography } from "../../theme"
import { useStores } from "../../models"
var options = {  year: 'numeric', month: 'long', day: 'numeric' };

export function PersonList({inputText}) {

 
  const {
    authenticationStore: { csvData, dataDisp , dataToBeDisplay, chooseDate},
  } = useStores()

  const [data, setData] = useState(csvData||dataDisp||{})
 

  useEffect(()=>{
    if(!inputText){
      setData(dataDisp)
      return ;
    }
      const newData = dataDisp.filter((item)=>{
        let found =false;
      
              for (const key in item) {
                
                if(item[key].toLowerCase().includes(inputText.toLowerCase())){
                    found = true;
                    break ;
                }
              
             }
      return found;
      })
      console.log("newData is -----------", newData.length)
      setData(newData);
  },[inputText])

const customButtonStyle: ViewStyle = {
    backgroundColor: colors.error,
    minHeight: 10,
    paddingVertical: 4,
  }
  const $customButtonTextStyle: TextStyle = {
    color: "white",
    // fontFamily: typography.primary.bold,
    textDecorationLine: "underline",
    //textDecorationColor: colors.error,
    fontSize: 12,
  }
 
  const Person = ({ item = {}, index }) => {
    const [status, setStatus] = useState("NULL")

console.log("item ----------------------", item)

        const handleAttendence = (value)=>{

    
              if(item)
         item[`${chooseDate}`] = value;
             if(index ==6)
                console.log("item is ", item)
          setStatus(value);
        } 

    return (
      <Card
        style={{
          shadowRadius: 5,
          marginHorizontal: 8,
          marginVertical: 4,
  
          shadowOpacity: 0.5,
        }}
        heading={item?.Name}
        ContentComponent={
          <>
            <View style={{  }}>
              <Text>ID: {item?.NewID} </Text>
              <Text>Mobile No.: {item?.['Mobile no']}</Text>
            </View>
            <View style={{  }}>
              <Text>ID: {item?.NewID} </Text>
              <Text>Mobile No.: {item?.['Mobile no']}</Text>
            </View>
            {/* <Text style={{ color: "black", fontWeight: 'bold'}}>
              Status:
              <Text style={{color: status=='Present'?'green': status=='Absent'?'red':'orange' }}>  {status}</Text>
             
            </Text> */}
          </>
        }
        RightComponent={
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Button
              style={[customButtonStyle, { backgroundColor: "green" }]}
              onPress={() => {
                handleAttendence("Present")
              }}
              textStyle={$customButtonTextStyle}
            >
              P
            </Button>
            <Button
              style={customButtonStyle}
              textStyle={$customButtonTextStyle}
              onPress={() => {
                handleAttendence("Absent")
              }}
            >
              A
            </Button>
            <Button
              style={[customButtonStyle, { backgroundColor: "grey" }]}
              textStyle={$customButtonTextStyle}
              onPress={() => {
                handleAttendence("Other Reason")
              }}
            >
              O
            </Button>
          </View>
        }
        footer={   <Text style={{ color: "black", fontWeight: 'bold'}}>
        Status:
        <Text style={{color: status=='Present'?'green': status=='Absent'?'red':'orange' }}>  {status}</Text>
       
      </Text>}
      />
    )
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => {
        return <Person item={item} index={index} />
      }}
      keyboardShouldPersistTaps="always"
    />
  )
}

// @demo remove-file
