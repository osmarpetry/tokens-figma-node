class ObjectHelper {
  constructor() {}

  filterObjectChildrenByName(sourceObject, nameFilter) {
    return new Promise((resolve, reject) => {
        try {
          const filteredObject = sourceObject.filter((item) => {
            return item.name === nameFilter;
          })[0].children;
          
          resolve(filteredObject);
        } catch(error) {
          reject(error);
        }
    });
  }
}

module.exports = ObjectHelper;