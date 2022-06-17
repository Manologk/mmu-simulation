const STATE_IDLE = "idle";
const STATE_RUNNING = "running";
const STATE_PENDING = "pending";
function Process(size, time, state) {
	this.size = size;
	this.timeLeft = time;
	this.state = state;
	this.allocatedBlock = null;
	this.id = processID;
	processID += 1;

	this.isAllocated = function () {
		return this.allocatedBlock != null;
	};

	this.tick = function () {
		this.timeLeft -= 1;
	};
}

function MemControlBlock(size) {
	this.size = size;
	this.process = null;
	this.state = null;
	//Manolo

	//
	this.available = true;
	this.next = null;
	this.prev = null;
	this.fromPartition = false; // Used to determine whether height of a MemControlBlock needs to be added

	this.setProcess = function (process) {
		if (process == null) {
			this.process = null;
			this.available = true;
		} else {
			this.process = process;
			this.available = false;
		}
	};
}

// Simulates memory
function Heap() {
	this.head = null;
	this.size = 0;

	// Allocate process to memory.
	// Use best-fit method: from the list of holes, choose the smallest hole
	this.requestAllocation = function (process) {
		blockBestFit = this.head;

		// Make sure our initial best block is valid
		while (blockBestFit.size < process.size || !blockBestFit.available) {
			blockBestFit = blockBestFit.next;
			if (blockBestFit == null) {
				process.state = STATE_DENINED;
				return false;
			} // Means we couldn't even find an initial valid block
		}
		//log("Initial best block: " + blockBestFit.size);

		// See if there's an even better block
		block = blockBestFit.next;
		while (block != null) {
			//log("Testing block: " + block.size);
			if (
				block.size >= process.size &&
				block.available &&
				block.size < blockBestFit.size
			) {
				blockBestFit = block;
				process.STATE_RUNNING;
				log("New best block: " + blockBestFit.size);
			}
			block = block.next;
		}

		spaceLeftover = blockBestFit.size - (process.size + memControlBlockSize); // Space leftover if block was divided

		// Partition block if needed
		if (spaceLeftover > 0) {
			newBlock = new MemControlBlock(spaceLeftover);

			nextBlock = blockBestFit.next;
			if (nextBlock != null) {
				nextBlock.prev = newBlock;
				newBlock.next = nextBlock;
			}

			blockBestFit.next = newBlock;
			newBlock.prev = blockBestFit;

			blockBestFit.size = process.size;

			newBlock.fromPartition = true;
		}

		blockBestFit.setProcess(process);
		process.allocatedBlock = blockBestFit;
		return true;
	};

	this.deallocateProcess = function (process) {
		process.allocatedBlock.setProcess(null);
		process.allocatedBlock = null;
	};

	this.add = function (block) {
		if (this.head == null) {
			this.head = block;
		} else {
			block.next = this.head;
			this.head.prev = block;
			this.head = block;
		}

		this.size += block.size;
	};

	this.toString = function () {
		string = "[|";
		block = this.head;

		prefix = "";
		suffix = "</span> |";
		while (block != null) {
			if (block.available) {
				prefix = "<span style='color: #01DF01;'> ";
			} else {
				prefix = "<span style='color: #FF0000;'> ";
			}
			string += prefix + block.size + suffix;
			block = block.next;
		}

		string += "]";
		return string;
	};

	this.repaint = function () {
		block = this.head;
		memoryDiv.innerHTML = "";

		while (block != null) {
			height = (block.size / heap.size) * 100;
			if (block.fromPartition) {
				height += (memControlBlockSize / heap.size) * 100;
			}

			// Create div block element
			divBlock = document.createElement("div");
			divBlock.style.height = height + "%";
			divBlock.setAttribute("id", "block");
			if (block.available) {
				divBlock.className = "available";
			} else {
				divBlock.className = "unavailable";
			}
			memoryDiv.appendChild(divBlock);

			// Add size label
			// TODO: Show process details on mouse over
			blockLabel = document.createElement("div");
			blockLabel.setAttribute("id", "blockLabel");
			blockLabel.style.height = height + "%";
			blockLabel.innerHTML = block.size + "K";
			if (height <= 2) {
				blockLabel.style.display = "none";
			}
			divBlock.appendChild(blockLabel);

			block = block.next;
		}
	};
}

// Handle front-end process submission
document.getElementById("processForm").onsubmit = function () {
	elements = this.elements; // Form elements

	inProcessSize = elements.namedItem("processSize");
	inProcessTime = elements.namedItem("processTime");

	process = new Process(
		parseInt(inProcessSize.value),
		parseInt(inProcessTime.value),
		// STATE_RUNNING
	);

	/*	heap.requestAllocation(process);
	  heap.repaint();*/
	processes.push(process);
	addProcessToTable(process);

	// Debug log
	log("Requesting: " + process.size);
	log(heap.toString() + "<br>");

	// Clear form
	inProcessSize.value = "";
	inProcessTime.value = "";

	return false;
};

function log(string) {
	logBox.innerHTML += string + "<br />";
}

function addProcessToTable(process) {
	row = document.createElement("tr");
	row.setAttribute("id", "process" + process.id);

	colName = document.createElement("td");
	colName.innerHTML = process.id;

	colSize = document.createElement("td");
	colSize.innerHTML = process.size;

	colTime = document.createElement("td");
	colTime.setAttribute("id", "process" + process.id + "timeLeft");
	colTime.innerHTML = process.timeLeft;


	colState = document.createElement("td");
	colState.setAttribute("id", "process" + process.id + "state");
	colState.innerHTML = process.state;

	row.appendChild(colName);
	row.appendChild(colSize);
	row.appendChild(colTime);
	row.appendChild(colState);
	processTable.appendChild(row);
}

function removeProcessFromTable(process) {
	processTable.removeChild(document.getElementById("process" + process.id));
}

// TODO: Update 'time left' for each row in table
function refreshTable() {
	for (i = 0; i < processes.length; i++) {
		process = processes[i];
		//the time remaining
		document.getElementById("process" + process.id + "timeLeft").innerHTML =
			process.timeLeft;
	}

	for (i = 0; i < processes.length; i++){
		process = processes[i];
		document.getElementById("process" + process.id + "state").innerHTML = 
			process.state;
	}

}

var logBox = document.getElementById("logBox");
var memoryDiv = document.getElementById("memory");
var processTable = document.getElementById("processTable");

var memControlBlockSize = 16;
var processID = 0;
var processes = [];

heap = new Heap();
blockSizes = [256, 256, 256, 256];

for (i = 0; i < blockSizes.length; i++) {
	heap.add(new MemControlBlock(blockSizes[i]));
}

// Draw initial heap
heap.repaint();

// Start clock
// Loop through all processes and allocate those that require allocation. Deallocate those that have <0 time remaining
var clock = setInterval(function () {
	for (i = 0; i < processes.length; i++) {
		process = processes[i];

		if (!process.isAllocated()) {
			heap.requestAllocation(process);
		} else {
			process.tick();
			if (process.timeLeft < 0) {
				// Deallocate process from heap
				// heap.deallocateProcess(process);

				// Remove process from processes array
				index = processes.indexOf(process);
				if (index > -1) {
					processes.splice(index, 1);
					this.state = STATE_IDLE;
				}

				// Remove process from table
				// removeProcessFromTable(process);
			}
		}
	}

	refreshTable();
	heap.repaint();
}, 1000);