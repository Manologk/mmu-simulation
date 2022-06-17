function Process(name, size, state) {
  this.size = size;
  this.name = name;
  this.state = state;
  this.allocatedBlock = null;
  this.id = processID;

  this.isAllocated = function () {
    return this.allocatedBlock != null;
  };

  this.isMemAvail = function () {
    if (size > sum(lst) - 1) {
      return true;
    }
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

function vMemBlock() {
  this.size = 0;
  this.block = null;

  this.requestAllocation = function (process) {
    block = this.block;

    while (this.block.size < process.size || !this.block.available) {
      block = block.next;
      if (block == null) {
        return false;
      }
    }

    block = block.next;
    while(block != null){

      if(
        block.size >=  process.size && block.available && block.size  < block.size){
          block = this.block;
        }
      
    }

    if(availableVmem > 0){
      this.block.setProcess(process)
      return  true;
    }
}


  
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

}




function sum(lst) {
  let f_sum = 0;
  for (let i = 0; i < lst.length; i++) {
    f_sum += lst[i][1];
  }
  return f_sum;
}

function virt_Memo(id, process) {
  availableVmem = sum(vMemBlock);
  this.addProcessToVirtualMem = function (id, process) {
    if (!(process > availableVmem)) {
      vMemBlock.push([id, process]);
    }
  };
}
