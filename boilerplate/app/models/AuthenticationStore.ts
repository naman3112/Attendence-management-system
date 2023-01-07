import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { save, loadString , load} from "../utils/storage"

const initializeFromAsyncStorage = async (obj)=> {
  const result = await AsyncStorage.getItem('csvData')
  if (result !== null) {
     obj = JSON.parse(result)
     return obj
  }
}

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    authPassword: "",
   // csvData: types.array(CSVdata)
    csvData: types.maybe(types.string)
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.csvData
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
     setCsvData (value){
      store.csvData = JSON.stringify(value);
      save('csvData', value);
      console.log("saved called ");

    },
    
    getCsvData(){
 load('csvData').then((val)=>{
  console.log("here the hell")
    console.log("answer is ", val);
    this.setCsvData(val)
 }).catch((e)=>{
console.log("error is ", e)
 })
    console.log("store.csvdata is ----- +++++++", store.csvData);
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
