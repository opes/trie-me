export class TrieNode {
  value;
  complete = false;
  parent = null;
  children = {};

  constructor(value) {
    this.value = value;
  }

  getWord() {
    let word = '';
    let current = this;

    while (current?.value) {
      word = current.value + word;
      current = current.parent;
    }

    return word;
  }
}

export class Trie {
  root;

  constructor() {
    this.root = new TrieNode(null);
  }

  insert(word) {
    if (!word) return null;
    let current = this.root;

    for (let char of word.toLowerCase()) {
      current.children[char] ??= new TrieNode(char);
      current.children[char].parent = current;
      current = current.children[char];
    }

    current.complete = true;
  }

  remove(word) {
    if (!word) return null;
    let current = this.root;

    for (let char of word.toLowerCase()) {
      if (!current.children[char]) return false;
      current = current.children[char];
    }

    // Mark it as incomplete and start deleting upwards
    current.complete = false;

    while (current) {
      if (
        // If the current node doesn't have children...
        Object.keys(current.children).length === 0 &&
        // and it's not a complete word...
        !current.complete &&
        // and it has a parent...
        current.parent
      ) {
        // Get the parent node & delete the current node
        const { parent } = current;
        delete parent.children[current.value];

        // Set pointer to our parent node (i.e. moving upwards)
        current = parent;
      } else {
        current = null;
      }
    }
  }

  contains(word) {
    if (!word) return null;
    let current = this.root;

    for (let char of word.toLowerCase()) {
      if (!current.children[char]) return false;
      current = current.children[char];
    }

    return current.complete;
  }

  find(word) {
    if (!word) return null;
    const words = [];
    let current = this.root;

    for (let char of word.toLowerCase()) {
      if (!current.children[char]) return words;
      current = current.children[char];
    }

    this.findAll(current, words);

    return words;
  }

  findAll(node, words) {
    if (node.complete) {
      words.push(node.getWord());
    }

    for (let child in node.children) {
      this.findAll(node.children[child], words);
    }
  }

  getAllWords() {
    let words = [];
    let queue = [this.root];

    while (queue.length) {
      let current = queue.shift();

      if (Object.keys(current.children).length) {
        for (let node of Object.values(current.children)) {
          queue.push(node);
        }
      }

      if (current.complete) words.push(current.getWord());
    }

    return words;
  }
}

export const censor = (sentence = '', swears = new Trie()) => {
  return sentence
    .split(' ')
    .reduce((results, word) => {
      const parsedWord = word.replace(/\W/gi, '');

      if (swears.contains(parsedWord)) {
        results.push(word.replace(/\w/gi, '*'));
      } else {
        results.push(word);
      }

      return results;
    }, [])
    .join(' ');
};
