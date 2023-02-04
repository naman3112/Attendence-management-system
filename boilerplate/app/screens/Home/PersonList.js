import React, { ReactNode, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, FlatList, Text } from "react-native"
import { Card, Button } from "../../components"
// import { Text } from "../../components"
import { colors } from "../../theme"
//import { colors, spacing, typography } from "../../theme"
import { useStores } from "../../models"
export function PersonList({inputText}) {

 
  const {
    authenticationStore: { csvData },
  } = useStores()
  const [data, setData] = useState(csvData)
  useEffect(()=>{
    console.log("input text --- ", inputText)
    if(!inputText){
      setData(csvData)
      console.log("sasa",csvData.length, inputText)
      return ;
    }
      const newData = csvData.filter((item)=>{
        let found =false;
      
              for (const key in item) {
                
                if(item?.[key].toLowerCase().includes(inputText.toLowerCase())){
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
  const Person = ({ item }) => {
    const [status, setStatus] = useState("")
    return (
      <Card
        style={{
          shadowRadius: 5,
          marginHorizontal: 8,
          marginVertical: 4,
  
          shadowOpacity: 0.5,
        }}
        heading={item.Name}
        ContentComponent={
          <>
            <View style={{  }}>
              <Text>ID: {item.NewID} </Text>
              <Text>Mobile No.: {item['Mobile no']}</Text>
            </View>
            <View style={{  }}>
              <Text>ID: {item.NewID} </Text>
              <Text>Mobile No.: {item['Mobile no']}</Text>
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
                setStatus("Present")
              }}
              textStyle={$customButtonTextStyle}
            >
              P
            </Button>
            <Button
              style={customButtonStyle}
              textStyle={$customButtonTextStyle}
              onPress={() => {
                setStatus("Absent")
              }}
            >
              A
            </Button>
            <Button
              style={[customButtonStyle, { backgroundColor: "grey" }]}
              textStyle={$customButtonTextStyle}
              onPress={() => {
                setStatus("Other Reason")
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
        return <Person item={item} />
      }}
      keyboardShouldPersistTaps="always"
    />
  )
}

// @demo remove-file
