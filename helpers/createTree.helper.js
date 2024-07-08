const createTree =  (records, parent_id = '', id) => {   // phân cấp danh mục
    const tree = [];
      for (const element of records) {
        if(element.parent_id == parent_id){
          const child = createTree(records, element.id);
          if(child.length > 0) {
            element.child = child;
          }
          tree.push(element);
        }
      }
    return tree;
  }

module.exports = (records, parent_id = '') => {
    const tree = createTree(records, parent_id);
    return tree;
}