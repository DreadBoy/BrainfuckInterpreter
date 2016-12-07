var brainfuck = function (){

	var register = [];
	var index = 0;
	var maxIndex = 0;

	var input = "";
	var inputIndex = 0;

	var code = "";
	var codeIndex = 0;

	var allowed = [">", "<", "+", "-", ".", ",", "[", "]"];

	var errorCallback = null;
	var outputCallback = null;

	var ret = new function Brainfuck(){};

	ret.reset = function reset(){
		register = Array(1).fill(0);
		index = 0;

		input = document.querySelector("#input").value;
		inputIndex = 0;

		code = document.querySelector("#code").value;
		codeIndex = 0;
	};

	function nextCommand(){
		while(!allowed.includes(code[codeIndex]) && codeIndex < code.length)
			codeIndex++;
		var ret = code[codeIndex];
		codeIndex++;
		return ret;
	};

	var executeCommand = function (){

		var commands = {
			">": function(){
				index++;
				if(index >= register.length)
					register[index] = 0;
			},
			"<": function(){
				if(index === 0)
					errorHandler("You are at 0th cell, can't go left.");
				index--;
			},
			"+": function(){
				if(register[index] === 255)
					errorHandler("Cell's value can't be more than 255.");
				register[index]++;
			},
			"-": function(){
				if(register[index] === 0)
					errorHandler("Cell's value can't be less than 0.");
				register[index]--;
			},
			"[": function(){
				if(register[index] != 0) {
					return;
				}
				var matching = codeIndex;
				var inner = 0;
				while(!(code[matching] === "]" && inner === 0)) {
					if(code[matching] === "[")
						inner++;
					if(code[matching] === "]")
						inner--;
					matching++;
				}
				codeIndex = matching + 1;
			},
			"]": function(){
				if(register[index] === 0) {
					return;
				}
				var matching = codeIndex - 2;
				var inner = 0;
				while(!(code[matching] === "[" && inner === 0)) {
					if(code[matching] === "]")
						inner++;
					if(code[matching] === "[")
						inner--;
					matching--;
				}
				codeIndex = matching + 1;
			},
			".": function(){
				outputHandler(String.fromCharCode(register[index]));
			},
			";": function(){
				register[index] = nextInput().charCodeAt(0);
			}
		};

		return function executeCommand(command){
			commands[command]();
		};
	}();

	ret.executeCode = function executeCode(){
		ret.reset();
		var command = nextCommand();
		while(command){
			executeCommand(command);
			command = nextCommand();
		};
	};

	function nextInput() {
		var ret = input[inputIndex];
		inputIndex++;
		return ret;
	};

	ret.internalState = function internalState(){
		var str = "";

		for (var i = 0; i < register.length; i++) {
			if(index === i)
				str += "<strong>";
			str += "[" + register[i] + "]";
			if(index === i)
				str += "</strong>";
		}

		return str;
	};

	var outputHandler = function(msg){
		if(outputCallback)
			outputCallback(msg);
		else
			console(msg);
	};

	ret.outputHandler = function (callback){

		outputCallback = function outputHandler(msg){		
			if(callback)
				callback(msg);
		};
	};

	var errorHandler = function(msg){
		if(errorCallback)
			errorCallback(msg);
		else
			throw new Error(msg);
	};

	ret.errorHandler = function (callback){

		errorCallback = function errorHandler(msg){		
			if(callback)
				callback(msg);
		};
	};

	return ret;
}();



document.querySelector("#run").addEventListener("click", function(){

	brainfuck.errorHandler(function(msg){
		document.querySelector("#error").innerHTML = msg;
	});

	brainfuck.outputHandler(function(char){
		document.querySelector("#output").innerHTML += char;
	});

	document.querySelector("#error").innerHTML = document.querySelector("#output").innerHTML = "";
	brainfuck.executeCode();

	document.querySelector("#internalState").innerHTML = brainfuck.internalState();
});