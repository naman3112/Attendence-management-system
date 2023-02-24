import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { storeAnnotation } from "mobx/dist/internal"
import { AsyncStorage } from "react-native"
import { save, loadString, load, saveString } from "../utils/storage"
var options = {  year: 'numeric', month: 'long', day: 'numeric' };

const initializeFromAsyncStorage = async (obj) => {
  const result = await AsyncStorage.getItem("csvData")
  if (result !== null) {
    obj = JSON.parse(result)
    return obj
  }
}
export interface CsvData {
  any
}

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    authPassword: "",
    csvData: types.array(types.frozen()),
    dataDisp: types.array(types.frozen()),
    selectedFields: types.array(types.frozen()),
  })

  .views((store) => ({
    get isAuthenticated() {
      return store?.csvData && store?.csvData.length > 0
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
    setCsvData(value, from = false) {
      store.csvData = [...value]
      

      if (!from) {
        saveString("csvData", JSON.stringify(value))
      }
    },
    setExportedDataToStorage(val){
      console.log("val is", val[0]);
      saveString("exportedData", JSON.stringify(val));
    },
    setChooseDate(value) {
      store.chooseDate = value
    },
    setSelectedFields(value, saveToStorage = false) {
      store.selectedFields = [...value]
      console.log("store.selected field value", store.selectedFields)
        if(saveToStorage){
          saveString("selectedFields", JSON.stringify(value));
        }
    },

    dataToBeDisplay(value1, date='') {
      console.log("i am set in the new data DISP ")
    
      if (date) this.setChooseDate(date)
      store.dataDisp = [...value1]
    console.log("store.dataDisp", value1[0])
      this.setExportedDataToStorage(value1);
    },
    updateDataToBeExport(val){
      const newUpdatedDataIndex = store.csvData.findIndex((obj)=>{
        let found = true;
              for(let key  in obj){
                 if(obj[key]!=val[key]){
                  found=false;
                  
                  break;
                 }
                 
              }
            
              return found;
      })
      console.log("newUpdated Index")
      
      let newUpdatedData = [...store.dataDisp];
      newUpdatedData[newUpdatedDataIndex] = val;

      //console.log("Updated item in the array is ",newUpdatedData[newUpdatedDataIndex], newUpdatedData.length)
      console.log(newUpdatedData[0], "check ----------",newUpdatedDataIndex)
      this.dataToBeDisplay(newUpdatedData,'');
      //this.setExportedDataToStorage(newUpdatedData)
    },


    getSelectedFields(){
      load("selectedFields").then((val)=>{
        if(!val){
        //  this.setSelectedFields([]);
          return ;
        }
        this.setSelectedFields(val);
      }).catch((e)=>{
        console.log("error in selected field", e);
      })
    },
    getCsvData() {
      const dateString = new Date().toLocaleDateString("en-US", options)
    
      load("csvData")
        .then((val) => {
          if (!val) return
          this.setCsvData(val, true)
        })
        .catch((e) => {
          console.log("error is ", e)
        })
        this.setChooseDate(dateString)
    },
    getDataExport (){
      load("exportedData").then((val)=>{
          if(!val){
            return ;
          }
          console.log("Set data here ---")
          this.dataToBeDisplay(val);
      }).catch((e)=>{
        console.log("not able to set Exported data ", e);
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
      this.setSelectedFields([], true);
      this.setCsvData([]);
      this.setExportedDataToStorage([])
      store.csvData = [];
      store.dataDisp=[];
      store.selectedFields = [];
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
