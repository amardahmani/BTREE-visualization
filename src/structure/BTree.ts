import { LeafHierarchy, NodeHierarchy } from './Visualizator';
import { Node } from './Node';

export class BTree<T>{
    private root: Node<T>;
    private order: number;

    constructor(order: number){
        this.order = order;
        this.root = new Node<T>(true);
    }

    public insert(value: T) : void {
        // Commence par le nœud racine
        let current = this.root;
        // Appel à une méthode interne pour gérer l'insertion récursive
        this.insertNotFull(current,value);
        if(current.data.length === this.order) {
            const newRoot = new Node<T>(false);
            this.root = newRoot;
            newRoot.insert_child(current, 0);
            this.split(current, newRoot, 1);
        }
        console.log("inserting in the btree")
    }

    private insertNotFull(node: Node<T>, value: T) : void {
        if(!node.isLeaf){
            let pos = node.data.length;
            while(pos > 0 && node.data[pos-1] > value){
                pos--;
            }
            this.insertNotFull(node.children[pos], value);
            if (node.children[pos].data.length === this.order) {
                this.split(node.children[pos], node, pos + 1);
            }
        }else{
            node.insert_data(value);
        }
    }

    private split(child: Node<T>, parent: Node<T>, pos: number) : void {
        let newChild = new Node<T>(child.isLeaf);
        for(let i = 0; i < (this.order - 1) / 2 ; i++){
            newChild.insert_data(child.data.pop()!);
        }
        if(!child.isLeaf){
            for (let i = 0; i < Math.ceil((this.order - 1) / 2) + 1; i++) {
                newChild.insert_child(child.children.splice((this.order - 1) / 2 + 1, 1)[0], i);
            }
        }
        parent.insert_child(newChild, pos);
        parent.insert_data(child.data.pop()!);
        parent.isLeaf = false;
    }

    public getRoot() : Node<T>{
        return this.root;
    }

    public searchWithOperations(value: T): { found: boolean; operations: number } {
        const result = {
          found: false,
          operations: 0,
        };
    
        this.searchWithOperationsRecursive(this.root, value, result);
    
        return result;
    }
    
    private searchWithOperationsRecursive(node: Node<T>, value: T, result: { found: boolean; operations: number }): void {
        let i = 0;
        while (i < node.data.length && node.data[i] < value) {
          i++;
          result.operations++;
        }
    
        if (i < node.data.length && node.data[i] === value) {
          // Value found in the current node
          result.found = true;
        } else if (!node.isLeaf) {
          // Recursively search in the appropriate child node
          result.operations++; // Increment the operation count for each recursive call
          this.searchWithOperationsRecursive(node.children[i], value, result);
        }
    }
    
    public toHierarchy(node: Node<T>) {
        const hierarchy = new NodeHierarchy<T>();
        hierarchy.leaves = new LeafHierarchy<T>();
        for(let i=0; i<node.data.length; i++){
            hierarchy.leaves.pushKey(node.data[i]);
        }
        hierarchy.children = node.children.map((node) => this.toHierarchy(node));
        return hierarchy;
    }
}