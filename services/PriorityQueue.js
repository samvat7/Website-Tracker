class PriorityQueue {
    constructor(comparator) {
        this.data = [];
        this.comparator = comparator || ((a, b) => a - b);
    }

    swap(i, j) {
        [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
    }

    parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChildIndex(index) {
        return index * 2 + 1;
    }

    rightChildIndex(index) {
        return index * 2 + 2;
    }

    peek() {
        return this.data[0];
    }

    isEmpty() {
        return this.data.length === 0;
    }

    add(item) {

        console.log(`[PriorityQueue] Item: ${item.url}, ${item.nextPingTime}`);
        this.data.push(item);
        this.heapifyUp();
    }

    poll() {
        if (this.isEmpty()) {
            return null;
        }
        const item = this.data[0];
        const lastItem = this.data.pop();
        if (!this.isEmpty()) {
            this.data[0] = lastItem;
            this.heapifyDown();
        }
        return item;
    }

    heapifyUp() {
        let index = this.data.length - 1;
        while (index > 0 && this.comparator(this.data[index], this.data[this.parentIndex(index)]) < 0) {
            this.swap(index, this.parentIndex(index));
            index = this.parentIndex(index);
        }
    }

    heapifyDown() {
        let index = 0;
        while (this.leftChildIndex(index) < this.data.length) {
            let smallerChildIndex = this.leftChildIndex(index);
            if (this.rightChildIndex(index) < this.data.length && this.comparator(this.data[this.rightChildIndex(index)], this.data[smallerChildIndex]) < 0) {
                smallerChildIndex = this.rightChildIndex(index);
            }
            if (this.comparator(this.data[index], this.data[smallerChildIndex]) < 0) {
                break;
            }
            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    clear() {
        this.data = [];
    }

    print() {
        console.log(this.data.map((item, index) => {
            const readableTime = new Date(item.nextPingTime).toLocaleString();
            return `Index ${index}: { url: "${item.url}", nextPingTime: "${readableTime}"(${item.nextPingTime}) }`;
        }).join('\n'));
    }

    size(){

        return this.data.length;
    }
}

module.exports = PriorityQueue;