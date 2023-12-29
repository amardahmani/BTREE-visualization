import { BTree } from "../../structure/BTree";

type alias = BTree<number | string> | null

export default function treeObject(state: alias = null, action: any) {
    switch (action.type) {
        case 'CREATE_BTREE_OBJECT':
            if (action.dataType === 'number') {
                return new BTree<number>(parseInt(action.maxDegree));
            } else if (action.dataType === 'string') {
                return new BTree<string>(parseInt(action.maxDegree));
            }
            break; // Add a break statement here

        case 'INSERT_TREE':
            state!.insert(action.value);
            return state;

        case 'SEARCH_TREE':
            const searchResult = state!.searchWithOperations(action.value);
            return state;
        
        default:
            return state;
    }
}