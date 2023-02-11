import React, { ReactNode, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, FlatList, Text } from "react-native"
import { Card, Button } from "../../components"
// import { Text } from "../../components"
import { colors } from "../../theme"
//import { colors, spacing, typography } from "../../theme"
import { useStores } from "../../models"
var options = { year: "numeric", month: "long", day: "numeric" }

export function PersonList({ inputText }) {
  const {
    authenticationStore: { updateDataToBeExport, dataDisp, dataToBeDisplay, chooseDate, selectedFields },
  } = useStores()

  const [data, setData] = useState(dataDisp)

  useEffect(() => {
    if (!inputText) {
      setData(dataDisp)
      return
    }
    const newData = dataDisp.filter((item) => {
      let found = false

      for (const key in item) {
        if (item[key].toLowerCase().includes(inputText.toLowerCase())) {
          found = true
          break
        }
      }
      return found
    })
    setData(newData)
  }, [inputText])

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
    const [status, setStatus] = useState(item[`${chooseDate}`])
if(index ==0 ||index ==1){

}
    const handleAttendence = (value) => {
      console.log("hre")
      if (item) item[`${chooseDate}`] = value
      setStatus(value)
      let dateObject = {...item};
      dateObject[`${chooseDate}`] = value;
      
      updateDataToBeExport(dateObject)
     
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
            {selectedFields.map((field) => {
              return (
                <View key={item?.field} style={{}}>
                  <Text>
                    {field}: {item[`${field}`]}{" "}
                  </Text>
                </View>
              )
            })}

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
        footer={
          <Text style={{ color: "black", fontWeight: "bold" }}>
            Status:
            <Text
              style={{
                color: status == "Present" ? "green" : status == "Absent" ? "red" : "orange",
              }}
            >
              {" "}
              {status}
            </Text>
          </Text>
        }
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
