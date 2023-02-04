import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AsyncStorage } from "react-native"
import { save, loadString , load, saveString} from "../utils/storage"

const initializeFromAsyncStorage = async (obj)=> {
  const result = await AsyncStorage.getItem('csvData')
  if (result !== null) {
     obj = JSON.parse(result)
     return obj
  }
}
export interface CsvData {
any;
}

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    authPassword: "",
   // csvData: types.array(CSVdata)
    
  })
  .views((store) => ({
    get isAuthenticated() {
      console.log("store.csv data is -----", store.csvData)
      return store?.csvData && store?.csvData.length>0
    },
    get validationErrors() {
      return {
        authEmail: (function () {
          if (store.authEmail.length === 0) return "can't be blank"
          if (store.authEmail.length < 6) return "must be at least 6 characters"
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
            return "must be a valid email address"
          return ""
        })(),
        authPassword: (function () {
          if (store.authPassword.length === 0) return "can't be blank"
          if (store.authPassword.length < 6) return "must be at least 6 characters"
          return ""
        })(),
      }
    },
  }))
  .actions((store) => ({
     setCsvData (value, from=false){
      
      store.csvData = value;
      console.log("csvdata string tupe", value, value.length)
      if(!from)
      saveString('csvData', JSON.stringify(value));
    },
    
    getCsvData(){
 load('csvData').then((val)=>{
    console.log("answer is ", val);
    if(!val)
    return;
    
    this.setCsvData(val,true)
 }).catch((e)=>{
console.log("error is ", e)
 })
    },
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setAuthPassword(value: string) {
      store.authPassword = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
      store.authPassword = ""
    },
  }))
//   .preProcessSnapshot((snapshot) => {
//     console.log("here i am saving values as snapshots ", snapshot)
//     // remove sensitive data from snapshot to avoid secrets
//     // being stored in AsyncStorage in plain text if backing up store
//     if(!snapshot?.csvData){
//       const { authToken, authPassword, ...rest } = snapshot
//       return rest
//     }
//     const { authToken, authPassword,csvData, ...rest } = snapshot // eslint-disable-line @typescript-eslint/no-unused-vars
// console.log("csvData----", csvData)
//     // see the following for strategies to consider storing secrets on device
//     // https://reactnative.dev/docs/security#storing-sensitive-info

//     return rest
//   })

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
