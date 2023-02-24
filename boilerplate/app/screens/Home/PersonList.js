import { observer } from "mobx-react-lite"

import React, { ReactNode, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, FlatList, Text } from "react-native"
import { Card, Button } from "../../components"
// import { Text } from "../../components"
import { colors } from "../../theme"
//import { colors, spacing, typography } from "../../theme"
import { useStores } from "../../models"
var options = { year: "numeric", month: "long", day: "numeric" }

const PersonList = observer(({ inputText }) => {
  const {
    authenticationStore: {
      updateDataToBeExport,
      dataDisp,
      chooseDate,
      selectedFields,
    },
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
    width: 100,
    marginBottom: 4,
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
    if (index == 0 || index == 1) {
    }
    const handleAttendence = (value) => {
      if (item) item[`${chooseDate}`] = value
      setStatus(value)
      let dateObject = { ...item }
      dateObject[`${chooseDate}`] = value
      
      updateDataToBeExport(dateObject)
    }

    return (
      <Card
        key={item?.[selectedFields?.[0]]}
        style={{
          shadowRadius: 5,
          marginHorizontal: 8,
          marginVertical: 4,

          shadowOpacity: 0.5,
        }}
        heading={`${selectedFields?.[0]} :- ${item?.[selectedFields?.[0]]}`}
        ContentComponent={
          <>
            {selectedFields.map((field,index) => {
              if(index==0){
                return 
              }
              return (
                <View key={item?.field} style={{}}>
                  <Text ellipsizeMode="tail" numberOfLines={1}>
                    {field}: {item[`${field}`]}
                  </Text>
                </View>
              )
            })}
          </>
        }
        RightComponent={
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Button
              style={[customButtonStyle, { backgroundColor: "green" }]}
              onPress={() => {
                handleAttendence("Present")
              }}
              textStyle={$customButtonTextStyle}
            >
              Present
            </Button>
            <Button
              style={customButtonStyle}
              textStyle={$customButtonTextStyle}
              onPress={() => {
                handleAttendence("Absent")
              }}
            >
              Absent
            </Button>
            <Button
              style={[customButtonStyle, { backgroundColor: "blue" }]}
              textStyle={$customButtonTextStyle}
              onPress={() => {
                handleAttendence("Other Reason")
              }}
            >
              Other
            </Button>
            <Button
              style={[customButtonStyle, { backgroundColor: "grey" }]}
              textStyle={$customButtonTextStyle}
              onPress={() => {
                handleAttendence("")
              }}
            >
              Clear
            </Button>
          </View>
        }
        footer={
          <Text style={{ color: "black", fontWeight: "bold" }}>
            Status:
            <Text
              style={{
                color:
                  status?.toLowerCase() == "present"
                    ? "green"
                    : status?.toLowerCase() == "absent"
                    ? "red"
                    : status?.toLowerCase() == "other reason"
                    ? "blue"
                    : "orange",
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
})

// @demo remove-file
export default PersonList
