/* global define, getNextOptimalNode */
/**
 * 
 * Model controller to build, load, and retrieve Dragoon problems
 * @author: Brandon Strong
 * 
 **/

/**
 * 
 * NOTE: this.beginX, this.beginY, this.nodeWidth, and this.nodeHeight should 
 *      be set to match the requirements of the viewer part of the MVC. These 
 *      variables control where the nodes will begin being placed, and tell the
 *      model the size of the nodes to avoid collisions.
 * 
 * NOTE: Functions to alter nodes in the given model should only be used for 
 *      author mode. They are named with the convention: 
 *      action+"Node"+AffectedPart() (for example: addNode() or setNodeName()). 
 *      To alter a node on a problem the student is currently working on the 
 *      functions follow the convention: action+"StudentNode"+AffectedPart() 
 *      (for example: addStudentNode() or setStudentNodeName()).
 * 
 */

define([
    "dojo/_base/array", "dojo/_base/lang", "./node", "./student_node"
], function(array, lang, Node, StudentNode) {


    return function(){

 	var obj= {
            constructor: function(/*string*/ mode, /*string*/ name, /*object*/ properties) {
		// Summary: Initializes the object (the Dragoon problem)
		// Note: beginX and beginY specify coordinates where nodes can begin appearing
		//      when the student adds them; nodeWidth and nodeHeighth can be manually
		//      adjusted to allow enough room in between the nodes; _updateNextXYPosition()
		//      uses nodeWidth and nodeHeighth to know where to place new student nodes
		this.beginX = 100;
		this.beginY = 100;
		this.nodeWidth = 200;
		this.nodeHeight = 200;
		this.x = this.beginX;
		this.y = this.beginY;
		this.lastNodeVisible = null;
		this.ID = 1;
		this.taskName = name;
		this.properties = properties;
		this.checkedNodes = new Array();
		this.model = this._buildModel();

		/*
		 Define the "active model" (see doucumentation/javascript.md).
		 */
		obj.active = (mode == "AUTHOR")?obj.given: obj.student;
		
            },
	    taskDescription: null,
            /**
             * 
             * Private methods; these methods should not be accessed outside of this class
             *  
             */
            _buildModel: function() {
		// Summary: builds a model object after defining its attributes;
		//      not used when loading a model; only used by the constructor
		// Tags: private
		var newModel = {task: {

                    taskName: this.taskName,
                    properties: this.properties,
                    taskDescription: this.taskDescription,
                    givenModelNodes: [],
                    extraDescriptions: [],
                    studentModelNodes: []
                }};
		return newModel;
            },
            _updateNextXYPosition: function() {
		// Summary: keeps track of where to place the next node; function detects collisions
		//      with other nodes; is called in addStudentNode() before creating the node
		// Tags: private
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    var x = this.model.task.studentModelNodes[i].position.x;
                    var y = this.model.task.studentModelNodes[i].position.y;
                    while (this.x > x - this.nodeWidth && this.x < x + this.nodeWidth &&
                           this.y > y - this.nodeHeight && this.y < y + this.nodeHeight) {
			if (this.x + this.nodeWidth < document.documentElement.clientWidth + 100)
                            this.x += this.nodeWidth;
			else {
                            this.x = this.beginX;
                            this.y += this.nodeHeight;
			}
                    }
		}
            },
            _setStatus: function(/*string*/ id, /*string*/ part, /*string*/ status) {
		// Summary: tracks student progress (correct, incorrect) on a given node; 
		//      used in setStudentNodeSelection() and setToDemo()
		// Tags: private
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			switch (part) {
                        case "description":
                            this.model.task.givenModelNodes[i].addStatus(status, null, null, null, null);
                            break;
                        case "type":
                            this.model.task.givenModelNodes[i].addStatus(null, status, null, null, null);
                            break;
                        case "initial":
                            this.model.task.givenModelNodes[i].addStatus(null, null, status, null, null);
                            break;
                        case "units":
                            this.model.task.givenModelNodes[i].addStatus(null, null, null, status, null);
                            break;
                        case "equation":
                            this.model.task.givenModelNodes[i].addStatus(null, null, null, null, status);
                            break;
			}
            },
            _checkChildren: function(/*string*/ currentNodeID, /*string array*/ checkedNodes) {
		// Summary: searches the depth of a tree below the given node and returns an
		//      optimal child node; if no optimal child node exists it returns null
		// Note: checkedNodes is an array that stores the nodes that have been checked 
		//      to avoid an infinite loop; it is set to empty before _checkChildren() 
		//      is called by getNextOptimalNode()
		// Tags: private
		checkedNodes.push(currentNodeID);
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (currentNodeID === this.model.task.givenModelNodes[i].ID) {
			for (var ii = 0; ii < this.model.task.givenModelNodes[i].inputs.length; ii++)
                            if (checkedNodes.indexOf(this.model.task.givenModelNodes[i].inputs[ii].ID) === -1)
				if (!this.isNodeVisible(this.model.task.givenModelNodes[i].inputs[ii].ID)) {
                                    return this.model.task.givenModelNodes[i].inputs[ii].ID;
				} else {
                                    var temp = this._checkChildren(this.model.task.givenModelNodes[i].inputs[ii].ID, checkedNodes);
                                    if (temp !== null)
					return temp;
				}
			return null;
                    }
		return null;
            },
            /**
             * 
             * Public methods
             *  
             */

            /**
             * Functions to load or retrieve a model in string format
             */
            loadModel: function(/*object*/ model) {
		// Summary: loads a model object;
		//      allows Dragoon to load a pre-defined program or to load a users saved work
		//      Sets id for next node.
		this.model = model;
		var largest = "id1";
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (this.model.task.studentModelNodes[i].ID > largest)
			largest = this.model.task.studentModelNodes[i].ID;
		}
		for (i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (this.model.task.givenModelNodes[i].ID > largest)
			largest = this.model.task.givenModelNodes[i].ID;
		}
		this.ID = parseInt(largest.replace("id", "")) + 1;
            },
            getModelAsString: function() {
		// Summary: Returns a JSON object in string format
		//          Should only be used for debugging.
		return JSON.stringify(this.model, null, 4);
            },
            /**
             * GETTERS; retrieves specific attributes from a model; node attributes are usually
             * by accessed by the node's ID--if the ID is not known use getNodeIDByName("name");
             */
            getPhase: function() {
		return this.model.task.properties.phase;
            },
            getType: function() {
		return this.model.task.properties.type;
            },
            getTaskName: function() {
		return this.model.task.taskName;
            },
            getURL: function() {
		return this.model.task.properties.URL;
            },
            getStartTime: function() {
		return this.model.task.properties.startTime;
            },
            getEndTime: function() {
		return this.model.task.properties.endTime;
            },
            getTimeStep: function() {
		return this.model.task.properties.timeStep;
            },
            getUnits: function() {
		return this.model.task.properties.units;
            },
            getEachNodeUnits: function() {
		// Summary:  returns an object containing the units for each node
		var unitList = [];
		array.forEach(this.getNodes(), function(node) {
                    unitList.push(node.units);
		});
		return unitList;
            },
            getEachNodeUnitbyID: function() {
		//summary: returns key/value pair of node-id/unit
		var unitList = {};
		array.forEach(this.getNodes(), function(node) {
                    unitList[node.ID] = node.units;
		});
		return unitList;
            },
            getEachStudentNodeUnitbyID: function() {
            //summary: returns key/value pair of node-id/unit
            var unitList = {};
            array.forEach(this.getStudentNodes(), function(node) {
                unitList[node.ID] = node.units;
            });
            return unitList;
        },
            getAllUnits: function() {
		// Summary:  returns a list of all distinct units 
		// (string format) defined in a problem.
		// Need to order list alphabetically.
		var unitList = [this.getUnits()];
		array.forEach(this.getNodes(), function(node) {
                    if (array.indexOf(unitList, node.units) == -1) {
			unitList.push(node.units);
                    }
		});
		return unitList;
            },
            getTaskDescription: function() {
		return this.model.task.taskDescription;
            },
            getAllDescriptions: function() {
		// Summary: returns an array of all descriptions with
		// name (label) and any associated node id (value).
		// TO DO:  The list should be sorted.
		var d = [];
		array.forEach(this.getNodes(), function(node) {
                    d.push({label: node.correctDesc, value: node.ID});
		});
		array.forEach(this.getExtraDescriptions(), function(desc) {
                    d.push({label: desc, value: "invalid"});
		});
		return d;
            },
            getNodeNameByID: function(/*string*/ id) {
		// Summary: returns the name of a node matching the given student
		//      node  id.  If no match is found, then return null.
		var ret = null;
		array.some(this.getStudentNodes(), function(node){
		    if(node.ID == id && node.givenNodeID){
			ret = this.getNode(node.givenNodeID).name;
			return true;
		    } else
			return false;
		}, this);
		return ret; // returns null if the node cannot be found
            },
            getNodeIDByName: function(/*string*/ name) {
		// Summary: returns the id of a node matching the given name; the given 
		//      model nodes are searched first, followed by the student model nodes
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (name === this.model.task.givenModelNodes[i].name)
			return this.model.task.givenModelNodes[i].ID;
		}
		console.error("Can't find node name in given model: ", name);
		// Need to decide how to handle student model node name
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (name === this.model.task.studentModelNodes[i].name)
			return this.model.task.studentModelNodes[i].ID;
		}
		return null; // returns null if the node cannot be found
            },
            getNodeIDByDescription: function(/*string*/ description) {
		// Summary: returns the id of a node matching the given description; the given 
		//      model nodes are searched first, followed by the student model nodes
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (description === this.model.task.givenModelNodes[i].correctDesc)
			return this.model.task.givenModelNodes[i].ID;
		}
		return null; // returns null if the node cannot be found
            },
            getNodeType: function(/*string*/ id) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i].type;
		}
		return null;
            },
            //function added to get student node type
            getStudentNodeType: function(/*string*/ id) {
            for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                if (id === this.model.task.studentModelNodes[i].ID)
                    return this.model.task.studentModelNodes[i].type;
            }
            return null;
        },
            isParentNode: function(/*string*/ id) {
		// Summary: returns true if a node is the parent node in a tree structure; parent 
		//      nodes will be displayed first when the student demos a node name/description
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i].parentNode;
		}
		return null;
            },
            isExtraNode: function(/*string*/ id) {
		// Summary: returns true if the node is not required in the final model
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i].extra;
		}
		return null;
            },
            getNodeOrder: function(/*string*/ id) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i].order;
		}
		return null;
            },
            getNodeUnits: function(/*string*/ id) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i].units;
		}
		return null;
            },
            getNodeInputs: function(/*string*/ id) {
		// Summary: returns an array with the inputs that the node uses
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID && this.model.task.givenModelNodes[i].inputs.length !== 0) {
			var inputs = new Array();
			for (var ii = 0; ii < this.model.task.givenModelNodes[i].inputs.length; ii++)
                            inputs.push(this.model.task.givenModelNodes[i].inputs[ii].ID);
			return inputs;
                    }
		}
		return null;
            },
            isNodeInput: function(/*string*/ mainNodeID, /*string*/ inputID) {
		// Summary: returns true if the node identified by inputID is an 
		//      input into the mainNodeID 
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (mainNodeID === this.model.task.givenModelNodes[i].ID && this.model.task.givenModelNodes[i].inputs.length !== 0) {
			for (var ii = 0; ii < this.model.task.givenModelNodes[i].inputs.length; ii++)
                            if (inputID === this.model.task.givenModelNodes[i].inputs[ii].ID)
				return true;
			i = this.model.task.givenModelNodes.length;
                    }
		}
		return false;
            },
            isNodeVisible: function(/*string*/ id) {
		// Summary: returns true if the node is in the student model
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (id === this.model.task.studentModelNodes[i].ID)
			return true;
		}
		return false;
            },
            isNodesParentVisible: function(/*string*/ id) {
		// Summary: returns true if the node's parent is visible (if the 
		//      node is an input into another node that is in the student model
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    var temp = this.model.task.givenModelNodes[i].ID;
                    for (var ii = 0; ii < this.model.task.givenModelNodes[i].inputs.length; ii++)
			if (this.isNodeVisible(temp))
                            return true;
		}
		return false;
            },
            areNodeInputsVisible: function(/*string*/ id) {
		//Summary: returns true if all of the inputs in a given node are visible
		for (var i = 0; i < this.getNodeInputs(id).length; i++)
                    if (!this.isNodeVisible(this.getNodeInputs(id)[i]))
			return false;
		return true;
            },
            areAllNodesVisible: function(/*string*/ id) {
		//Summary: returns true if all of the inputs in the model are visible
		for (var i = 0; i < this.givenModelNodes(id).length; i++)
                    if (!this.isNodeVisible(this.givenModelNodes(id)[i]))
			return false;
		return true;
            },
            getOptimalNode: function() {
		// Summary: returns the ID of an optimal node to be used next
		// Note: the function first searches for an optimal child node 
		//      of the last valid node that was made visible, then if none 
		//      are found the function searches for a parent node that is 
		//      visible but still has descendant nodes that are not, and 
		//      then it searches for a parent node that has not been 
		//      defined, and then for any node that has not been defined 
		var id = null;
		if (this.lastNodeVisible !== null) {
                    //searches for an optimal child node of the last valid node that was made visible
                    id = getNextOptimalNode(this.lastNodeVisible);
                    if (id !== null)
			return id;
		}
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    //searches for a parent node that is visible but still has descendant nodes that are not
                    if (this.model.task.givenModelNodes[i].parentNode) {
			if (this.isNodeVisible(this.model.task.givenModelNodes[i].ID)) {
                            id = this.getNextOptimalNode(this.model.task.givenModelNodes[i].ID);
                            if (id !== null)
				return id;
			} else {
                            id = this.model.task.givenModelNodes[i].ID;
			}
                    }
		}
		if (id === null)
                    for (i = 0; i < this.model.task.givenModelNodes.length; i++)
			if (!this.isNodeVisible(this.model.task.givenModelNodes[i].ID))
                            return this.model.task.givenModelNodes[i].ID;
		return id;
            },
            getNextOptimalNode: function(/*string*/ currentNodeID) {
		// Summary: returns the next optimal child node of currentNodeID or 
		//      null if there is not an optimal child node
		var checkedNodes = [];
		return this._checkChildren(currentNodeID, checkedNodes);
            },
            getNextOptimalInput: function(/*string*/ currentNodeID) {
		//Summary: returns the next non-visible input to a node
		for (var i = 0; i < this.getNodeInputs(currentNodeID).length; i++)
                    if (!this.isNodeVisible(this.getNodeInputs(currentNodeID)[i]))
			return this.getNodeInputs(currentNodeID)[i];
		return null;
            },
            isDescriptionOptimal: function(/*string*/ description) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (this.model.task.givenModelNodes[i].correctDesc === description) {
			var id = this.model.task.givenModelNodes[i].ID;
			if (this.isNodeVisible(id))
                            return "alreadyExists";
			if (this.model.task.givenModelNodes[i].parentNode)
                            return "optimal";
			if (this.isNodesParentVisible(id))
                            return "optimal";
			return "notOptimal";
                    }
		}
		return "doesNotExist";
            },
            getNodeInitial: function(/*string*/ id) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i].initial;
		}
		return null;
            },
            getNodeEquation: function(/*string*/ id) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i].equation;
		}
		return null;
            },
            getNodeCorrectDescription: function(/*string*/ id) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i].correctDesc;
		}
		return null;
            },
            getNodeAttemptCount: function(/*string*/ id, /*string*/ part) {
		// Summary: returns the number of attempts a student has made on the 
		//      given part of the problem
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			switch (part) {
                        case "description":
                            return this.model.task.givenModelNodes[i].attemptCount.description;
                            break;
                        case "type":
                            return this.model.task.givenModelNodes[i].attemptCount.type;
                            break;
                        case "initial":
                            return this.model.task.givenModelNodes[i].attemptCount.initial;
                            break;
                        case "units":
                            return this.model.task.givenModelNodes[i].attemptCount.units;
                            break;
                        case "equation":
                            return this.model.task.givenModelNodes[i].attemptCount.equation;
                            break;
                        default:
                            console.error("Invalid part ", part);
			}
		return null;
            },
            incrementDescriptionAttemptCount: function(/*string*/ id) {
		// Summary: returns the number of attempts a student has made on the 
		//      given part of the problem
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			this.model.task.givenModelNodes[i].attemptCount.description++;
            },
            getNodeStatus: function(/*string*/ id, /*string*/ part) {
		// Summary: returns the progress (correct, incorrect, or demo) of 
		//      the given node's description section
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			switch (part) {
                        case "description":
                            return this.model.task.givenModelNodes[i].status.description;
                            break;
                        case "type":
                            return this.model.task.givenModelNodes[i].status.type;
                            break;
                        case "initial":
                            return this.model.task.givenModelNodes[i].status.initial;
                            break;
                        case "units":
                            return this.model.task.givenModelNodes[i].status.units;
                            break;
                        case "equation":
                            return this.model.task.givenModelNodes[i].status.equation;
                            break;
                        default:
                            console.error("Invalid part ", part);
			}
		return null;
            },
            getExtraDescriptions: function(/*string*/ type) {
		// Summary: returns an array of the extra descriptions by type; if 
		//      type is left blank all of the descriptions will be returned
		var descriptions = new Array();
		if (!type)
                    for (var i = 0; i < this.model.task.extraDescriptions.length; i++)
			descriptions.push(this.model.task.extraDescriptions[i].text);
		else
                    for (var i = 0; i < this.model.task.extraDescriptions.length; i++)
			if (this.model.task.extraDescriptions[i].type === type)
                            descriptions.push(this.model.task.extraDescriptions[i].text);
		return descriptions;
            },
            isStudentModelEmpty: function() {
		// Summary: returns true if the the student model is empty
		if (this.model.task.studentModelNodes)
                    return true;
		return false;
            },
            isInGivenModel: function(/*string*/ id) {
		// Summary: returns true if a node in the student model is also found in the given model
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (id === this.model.task.studentModelNodes[i].ID)
			return this.model.task.studentModelNodes[i].givenNodeID;
		}
		return null;
            },
            getStudentNodeInputs: function(/*string*/ id) {
		var node = this.getStudentNode(id);
		// Summary: returns an array with the node ids that the student has selected as inputs
               return node && array.map(node.inputs, function(input) {
                    return input.ID;
               });
            },
            isStudentNodeInput: function(/*string*/ mainNodeID, /*string*/ inputID) {
		// Summary: returns true if the node identified by inputID is an 
		//      input into the mainNodeID in the Student Model
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (mainNodeID === this.model.task.studentModelNodes[i].ID && this.model.task.studentModelNodes[i].inputs.length !== 0) {
			i = this.model.task.studentModelNodes.length;
			for (var ii = 0; ii < this.model.task.studentModelNodes[i].inputs.length; ii++)
                            if (inputID === this.model.task.studentModelNodes[i].inputs[ii].ID)
				return true;
                    }
		}
		return false;
            },
            /*
             Brandon:  Here is a clean-up of some of the getters that
             uses a common function to find the node.  Note that it
             has error handling in the event that the id is invalid.
             
             It is not clear if these getters will be needed in this form.
             It might make for cleaner code (outside of model.js) if a node is passed in
             as an argument.
             */

            getStudentNodePosition: function(/*string*/ id) {
		var node = this.getStudentNode(id);
		return node && node.position;
            },
            getStudentNodeDesc: function(/*string*/ id) {
		var node = this.getStudentNode(id);
		return node && node.studentSelections.description;
            },
            getStudentNodePlan: function(/*string*/ id) {
		var node = this.getStudentNode(id);
		return node && node.studentSelections.plan;
            },
            getStudentNodeUnits: function(/*string*/ id) {
		var node = this.getStudentNode(id);
		return node && node.studentSelections.units;
            },
            getStudentNodeInitial: function(/*string*/ id) {
		var node = this.getStudentNode(id);
		return node && node.studentSelections.initial;
            },
            getStudentNodeEquation: function(/*string*/ id) {
		var node = this.getStudentNode(id);
		return node && node.studentSelections.equation;
            },
            getNodes: function() {
		// Summary: returns an array containing the nodes in the given model 
		return this.model.task.givenModelNodes;
            },
            getNode: function(/*string*/ id) {
		//Summary: returns a JavaScript object of a specified given model node
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			return this.model.task.givenModelNodes[i];
		console.error("Invalid node id: ", id);
		return null;
            },
            getStudentNode: function(/*string*/ id) {
		//Summary: returns a JavaScript object of a specified student model node
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (id === this.model.task.studentModelNodes[i].ID)
			return this.model.task.studentModelNodes[i];
		}
		console.error("Invalid node id: ", id);
		return null;
            },
            getStudentNodes: function() {
		// Summary: returns an array containing the nodes in the student model
		return this.model.task.studentModelNodes;
            },
            /**
             * SETTERS
             */
            setTaskName: function(/*string*/ name) {
		this.model.task.taskName = name;
            },
            setURL: function(/*string*/ url) {
		this.model.task.properties.URL = url;
            },
            setStartTime: function(/*int*/ start) {
		this.model.task.properties.startTime = start;
            },
            setEndTime: function(/*int*/ end) {
		this.model.task.properties.endTime = end;
            },
            setTimeStep: function(/*float*/ timeStep) {
		this.model.task.properties.timeStep = timeStep;
            },
            setModelUnits: function(/*string*/ units) {
		this.model.task.properties.units = units;
            },
            setPhase: function(/*string*/ phase) {
		// Summary: set the model's phase
		this.model.task.properties.phase = phase;
            },
            setType: function(/*string*/ type) {
		// Summary: set the model's type
		this.model.task.properties.type = type;
            },
            setTaskDescription: function(/*string*/ description) {
		// Summary: set the task description
		this.model.task.taskDescription = description;
            },
            /**
             * Functions to add and delete nodes in the given model and the student model
             */
            addNode: function() {
		// Summary: builds a new node and returns the node's unique id
		var id = "id" + this.ID;
		var order = this.model.task.givenModelNodes.length + 1;
		this.ID++;
		var newNode = new Node(id, order);
		this.model.task.givenModelNodes.push(newNode);
		return id;
            },
            deleteNode: function(/*string*/ id) {
		// Summary: deletes a node with a given id; re-orders the remaining nodes; removes the
		//      given node from other nodes' inputs and erases equations containing the deleted node
		var deleted = false;
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    this.deleteNodeInput(this.model.task.givenModelNodes[i].ID, id);
                    if (this.model.task.givenModelNodes[i].equation.indexOf(id) > -1)
			this.model.task.givenModelNodes[i].equation = "";
                    if (id === this.model.task.givenModelNodes[i].ID) {
			this.model.task.givenModelNodes.splice(this.model.task.givenModelNodes.indexOf(this.model.task.givenModelNodes[i]), 1);
			deleted = true;
			if (this.model.task.givenModelNodes.length > i)
                            this.model.task.givenModelNodes[i].order = this.model.task.givenModelNodes[i].order - 1;
                    }
                    else if (deleted)//maintains order of nodes during deletion                    
			this.model.task.givenModelNodes[i].order = this.model.task.givenModelNodes[i].order - 1;
		}
		this.deleteStudentNode(id);
		return deleted;
            },
            addNodeWithAttributes: function(/*string*/ name, /*bool*/ parent, /*string*/ type, /*bool*/ extra, /*string*/ units, /*float*/ initial, /*string*/ equation, /*string*/ correctDesc) {
		// Summary: create a new node and set its attributes in one step
		// Note: this function is useful for testing; if it is not needed it may be deleted when the MVC is complete
		var id = this.addNode();
		this.setNodeName(id, name);
		this.setNodeParent(id, parent);
		this.setNodeType(id, type);
		this.setNodeExtra(id, extra);
		this.setNodeUnits(id, units);
		this.setNodeInitial(id, initial);
		this.setNodeEquation(id, equation);
		this.setNodeCorrectDesc(id, correctDesc);
		return id;
            },
            setNodeName: function(/*string*/ id, /*string*/ name) {
		// Summary: sets the node's name; can be used to change the name as well
		//      and the matching node in the student model will update; the name
		//      must be unique (it cannot be used by another node)
		// Note: setNodeName() should be used in Author mode while 
		//      setStudentNodeName() should be used when a student is changing 
		//      a node name in the student model
		var arrayID1 = -1;
		var arrayID2 = -1;
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    // the first two for loops ensure that the node name is unique
                    if (this.model.task.givenModelNodes[i].name === name)
			return false;
                    if (this.model.task.givenModelNodes[i].ID === id)
			arrayID1 = i;
		}
		console.error("Can't find node id in given model: ", id, name);
		// Need to decide how to handle student model node id/naeme
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (this.model.task.studentModelNodes[i].name === name)
			return false;
                    if (this.model.task.studentModelNodes[i].ID === id)
			arrayID2 = i;
		}
		// the next two if statements change the name in the given model and the student model
		if (arrayID1 > -1)
                    this.model.task.givenModelNodes[arrayID1].name = name;
		if (arrayID2 > -1)
                    this.model.task.studentModelNodes[arrayID2].name = name;
		return true;
            },
            setNodeParent: function(/*string*/ id, /*bool*/ parent) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			this.model.task.givenModelNodes[i].parentNode = parent;
            },
            setNodeType: function(/*string*/ id, /*string*/ type) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			this.model.task.givenModelNodes[i].type = type;
            },
            setNodeExtra: function(/*string*/ id, /*bool*/ extra) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			this.model.task.givenModelNodes[i].extra = extra;
            },
            setNodeUnits: function(/*string*/ id, /*string*/ units) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			this.model.task.givenModelNodes[i].units = units;
            },
            setNodeInitial: function(/*string*/ id, /*float*/ initial) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			this.model.task.givenModelNodes[i].initial = initial;
            },
            setNodeEquation: function(/*string*/ id, /*string | object*/ equation) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			this.model.task.givenModelNodes[i].equation = equation;
            },
            setNodeCorrectDesc: function(/*string*/ id, /*string*/ correctDesc) {
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (id === this.model.task.givenModelNodes[i].ID)
			this.model.task.givenModelNodes[i].correctDesc = correctDesc;
            },
            addNodeInput: function(/*string*/ input, /*string*/ inputInto) {
		// Summary: adds a node (input) as an input into the given node (inputInto); both params are node ID strings
		var inputID = "";
		if (inputInto === input)//node can't be input into itself
                    return false;
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++)
                    if (input === this.model.task.givenModelNodes[i].ID) {
			inputID = this.model.task.givenModelNodes[i].ID;
			i = this.model.task.givenModelNodes.length;
                    } else {
			if (i === this.model.task.givenModelNodes.length - 1)
                            return false;
                    }
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (inputInto === this.model.task.givenModelNodes[i].ID) {

			for (var ii = 0; ii < this.model.task.givenModelNodes[i].inputs.length; ii++) {
                            if (input === this.model.task.givenModelNodes[i].inputs[ii].ID)
				return false;
			}
			this.model.task.givenModelNodes[i].addInput(inputID);
			return true;
                    }
		}
		return false;
            },
            deleteNodeInput: function(/*string*/ id, /*string*/ inputIDToRemove) {
		// Summary: remove an input from a node in the given model
		for (var i = 0; i < this.model.task.givenModelNodes.length; i++) {
                    if (id === this.model.task.givenModelNodes[i].ID)
			for (var ii = 0; ii < this.model.task.givenModelNodes[i].inputs.length; ii++) {
                            if (inputIDToRemove === this.model.task.givenModelNodes[i].inputs[ii].ID) {
				this.model.task.givenModelNodes[i].inputs.splice(this.model.task.givenModelNodes[i].inputs.indexOf(this.model.task.givenModelNodes[i].inputs[ii]), 1);
                            }
			}
		}
            },
            addExtraDescription: function(/*string*/ text, /*string*/ type) {
		// Summary: allows author to add extra descriptions that are not
		//      required in the completed model to further challenge the 
		//      the student
		// Note: type should be "model" (meaning the description is 
		//      referred to in the model's task description but is not 
		//      required to complete the model) or "extra" (meaning the 
		//      description is not mentioned in the problem and is not 
		//      needed to solve the problem)
		this.model.task.extraDescriptions.push({text: text, type: type});
            },
            addStudentNode: function() {
		// Summary: builds a new node in the student model and returns the node's unique ID
		var id = "id" + this.ID;
		this._updateNextXYPosition();
		var xPos = this.x;
		var yPos = this.y;
		this.ID++;
		var newNode = new StudentNode(id, xPos, yPos);
		this.model.task.studentModelNodes.push(newNode);
		return id;
            },
            deleteStudentNode: function(/*string*/ id) {
		// Summary: deletes a node with a given id from the student model; removes
		//      the given node from other nodes inputs within the student model and
		//      erases equations containing the deleted node; resets matching given
		//      model nodes to no longer be marked correct
		var deleted = false;
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    this.deleteStudentNodeInput(this.model.task.studentModelNodes[i].ID, id);
                    if (this.model.task.studentModelNodes[i].studentSelections.equation.indexOf(id) > -1)
			this.model.task.studentModelNodes[i].studentSelections.equation = "";
                    if (id === this.model.task.studentModelNodes[i].ID) {
			if (this.model.task.studentModelNodes[i].givenNodeID) // checks if node was in given model
                            for (var ii = 0; ii < this.model.task.givenModelNodes.length; ii++)
				if (this.model.task.givenModelNodes[ii].ID === id)
                                    this.model.task.givenModelNodes[ii].resetStatus();
			this.model.task.studentModelNodes.splice(this.model.task.studentModelNodes.indexOf(this.model.task.studentModelNodes[i]), 1);
			deleted = true;
			break;
                    }
		}
		return deleted;
            },
            setStudentNodeName: function(/*string*/ id, /*string*/ name) {
		// Summary: sets a name for the student model node and attempts to match it against
		//      the given model; returns the nodes ID
		// Note: this function should only be used to set the name of a node in the student 
		//      model; if a problem is being authored, used setNodeName() to change the name 
		//      of a node in the given model; if an author wants a problem to appear in both
		//      the given model and the student model (so that the node appears when the 
		//      problem is started) use setNodeName() to change the name in models both and 
		//      to maintain the connection between the nodes
		console.error("setStudentNodeName breaks current design");
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++)
                    // this first for loop ensures that the node name is unique to other student model node names
                    if (this.model.task.studentModelNodes[i].name === name)
			return null;
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (id === this.model.task.studentModelNodes[i].ID) {
			if (this.model.task.studentModelNodes[i].givenNodeID) {
                            // if givenNodeID exists and name is being changed then node must be re-created 
                            //      to reset values; new node will be at position studentModelNodes.length - 1
                            this.deleteStudentNode(id);
                            id = this.addStudentNode();
                            i = this.model.task.studentModelNodes.length - 1;
			}
			this.model.task.studentModelNodes[i].name = name;
			for (var ii = 0; ii < this.model.task.givenModelNodes.length; ii++) {
                            if (name === this.model.task.givenModelNodes[ii].name) {
				this.model.task.studentModelNodes[i].givenNodeID = 
				    this.model.task.givenModelNodes[ii].ID;
				id = this.model.task.studentModelNodes[i].ID;
				this.lastNodeVisible = id;
				return id;
                            }
			}
                    }
		}
		this.lastNodeVisible = id;
		return id;
            },
            addStudentNodeWithName: function(/*string*/ name) {
		// Summary: create a new node in the StudentModel and set its attributes in one step
		//      returns the nodes ID, which updates to match the given model node, if it exists
		var id = this.addStudentNode();
		return this.setStudentNodeName(id, name);
            },
            addStudentNodeInput: function(/*string*/ input, /*string*/ inputInto) {
		// Summary: adds a node (input) as an input into the given node in 
		//      the StudentModel (inputInto) both parameters are node ID's
		var inputID = "";
		if (inputInto === input)//node can't be input into itself
                    return false;
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++)
                    if (input === this.model.task.studentModelNodes[i].ID) {
			inputID = this.model.task.studentModelNodes[i].ID;
			i = this.model.task.studentModelNodes.length;
                    } else {
			if (i === this.model.task.studentModelNodes.length - 1)
                            return false;
                    }
		for (i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (inputInto === this.model.task.studentModelNodes[i].ID) {

			for (var ii = 0; ii < this.model.task.studentModelNodes[i].inputs.length; ii++) {
                            if (input === this.model.task.studentModelNodes[i].inputs[ii].ID)
				return false;
			}
			this.model.task.studentModelNodes[i].addInput(inputID);
			return true;
                    }
		}
		return false;
            },
            deleteStudentNodeInput: function(/*string*/ id, /*string*/ inputIDToRemove) {
		// Summary: remove an input from a node in the student model
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (id === this.model.task.studentModelNodes[i].ID)
			for (var ii = 0; ii < this.model.task.studentModelNodes[i].inputs.length; ii++) {
                            if (inputIDToRemove === this.model.task.studentModelNodes[i].inputs[ii].ID) {
				this.model.task.studentModelNodes[i].inputs.splice(this.model.task.studentModelNodes[i].inputs.indexOf(this.model.task.studentModelNodes[i].inputs[ii]), 1);
                            }
			}
		}
            },
            setStudentNodeXY: function(/*string*/ id, /*int*/ xPos, /*int*/ yPos) {
		// Summary: sets the "X" and "Y" values of a node's position
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++)
                    if (id === this.model.task.studentModelNodes[i].ID) {
			this.model.task.studentModelNodes[i].position.x = xPos;
			this.model.task.studentModelNodes[i].position.y = yPos;
                    }
            },
            setStudentNodeSelection: function(/*string*/ id, /*string*/ part, /*string*/ studInput) {
		// Summary: saves student choices in the Student Model; 'id' refers to 
		//      the node ID, 'part' refers the the part of the node, 'studInput'
		//      refers to the student input
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++) {
                    if (id === this.model.task.studentModelNodes[i].ID) {
			switch (part) {
                        case "description":
                            this.model.task.studentModelNodes[i].setStudentSeletions(studInput, null, null, null, null);
                            if (this.model.task.studentModelNodes[i].givenNodeID) {
                                if (this.getNodeCorrectDescription(id) === studInput)
                                    this._setStatus(id, part, "correct");
                                else
                                    this._setStatus(id, part, "incorrect");
                                for (var ii = 0; ii < this.model.task.givenModelNodes.length; ii++)
                                    if (id === this.model.task.givenModelNodes[i].ID)
                                        this.model.task.givenModelNodes[ii].addAttempt(true, false, false, false, false);
                            }
                            return true;
                            break;
                        case "type":
                            this.model.task.studentModelNodes[i].setStudentSeletions(null, studInput, null, null, null);
                            if (this.model.task.studentModelNodes[i].givenNodeID) {
                                if (this.getNodeType(id) === studInput)
                                    this._setStatus(id, part, "correct");
                                else
                                    this._setStatus(id, part, "incorrect");
                                for (var ii = 0; ii < this.model.task.givenModelNodes.length; ii++)
                                    if (id === this.model.task.givenModelNodes[ii].ID)
                                        this.model.task.givenModelNodes[ii].addAttempt(false, true, false, false, false);
                            }
                            return true;
                            break;
                        case "initial":
                            this.model.task.studentModelNodes[i].setStudentSeletions(null, null, studInput, null, null);
                            if (this.model.task.studentModelNodes[i].givenNodeID) {
                                if (this.getNodeInitial(id) === studInput)
                                    this._setStatus(id, part, "correct");
                                else
                                    this._setStatus(id, part, "incorrect");
                                for (var ii = 0; ii < this.model.task.givenModelNodes.length; ii++)
                                    if (id === this.model.task.givenModelNodes[ii].ID)
                                        this.model.task.givenModelNodes[ii].addAttempt(false, false, true, false, false);
                            }
                            return true;
                            break;
                        case "units":
                            this.model.task.studentModelNodes[i].setStudentSeletions(null, null, null, studInput, null);
                            if (this.model.task.studentModelNodes[i].givenNodeID) {
                                if (this.getNodeUnits(id) === studInput)
                                    this._setStatus(id, part, "correct");
                                else
                                    this._setStatus(id, part, "incorrect");
                                for (var ii = 0; ii < this.model.task.givenModelNodes.length; ii++)
                                    if (id === this.model.task.givenModelNodes[ii].ID)
                                        this.model.task.givenModelNodes[ii].addAttempt(false, false, false, true, false);
                            }
                            return true;
                            break;
                        case "equation":
                            this.model.task.studentModelNodes[i].setStudentSeletions(null, null, null, null, studInput);
                            if (this.model.task.studentModelNodes[i].givenNodeID) {
                                if (this.getNodeEquation(id) === studInput)
                                    this._setStatus(id, part, "correct");
                                else
                                    this._setStatus(id, part, "incorrect");
                                for (var ii = 0; ii < this.model.task.givenModelNodes.length; ii++)
                                    if (id === this.model.task.givenModelNodes[ii].ID)
                                        this.model.task.givenModelNodes[ii].addAttempt(false, false, false, false, true);
                            }
                            return true;
                            break;
                        default:
                            console.error("Invalid part ", part);
			}
                    }
		}
		return false;
            },
            setToDemo: function(/*string*/ id, /*string*/ part) {
		// Summary: sets the given part of the problem to "demo" in the given node
		//      and puts the correct answer into the studentModelNode; intended to 
		//      be used when the student asks for the answer or attempts the question 
		//      incorrectly too many times
		for (var i = 0; i < this.model.task.studentModelNodes.length; i++)
                    if (id === this.model.task.studentModelNodes[i].ID) {
			switch (part) {
                        case "description":
                            this.model.task.studentModelNodes[i].setStudentSeletions(this.getNodeCorrectDescription(id), null, null, null, null);
                            break;
                        case "type":
                            this.model.task.studentModelNodes[i].setStudentSeletions(null, this.getNodeType(id), null, null, null);
                            break;
                        case "initial":
                            this.model.task.studentModelNodes[i].setStudentSeletions(null, null, this.getNodeInitial(id), null, null);
                            break;
                        case "units":
                            this.model.task.studentModelNodes[i].setStudentSeletions(null, null, null, this.getNodeUnits(id), null);
                            break;
                        case "equation":
                            this.model.task.studentModelNodes[i].setStudentSeletions(null, null, null, null, this.getNodeEquation(id));
                            break;
                        default:
                            console.error("Invalid part ", part);
			}
			this._setStatus(id, part, "demo");
                    }
            }
	};

	/* 
	 add subclasses with model accessors 
	 */

	obj.given = {
	    isNode: function(/*string*/ id){
		return array.some(this.getNodes(),function(node){
		    return node.ID === id;
		});
	    },
	    getNodes: lang.hitch(obj, obj.getNodes),
            getNodeEquation: lang.hitch(obj, obj.getNodeEquation),
            getNodeInitial: lang.hitch(obj, obj.getNodeInitial),
            getNodeType: lang.hitch(obj, obj.getNodeType),
            getEachNodeUnitbyID: lang.hitch(obj, obj.getEachNodeUnitbyID),
	    setNodeName: lang.hitch(obj, obj.setNodeName)
	};

	obj.student = {
	    getGivenNodeID: function(id){
		// Return any matched given model id for student node.
		var node = this.getNode(id);
		return node && node.givenNodeID;
	    },
	    getNodes: lang.hitch(obj, obj.getStudentNodes),
	    getNode: lang.hitch(obj, obj.getStudentNode),
            getNodeEquation: lang.hitch(obj, obj.getStudentNodeEquation),
            getNodeInitial: lang.hitch(obj, obj.getStudentNodeInitial),
            getNodeType: lang.hitch(obj, obj.getStudentNodeType),
            getEachNodeUnitbyID: lang.hitch(obj, obj.getEachStudentNodeUnitbyID),
	    setNodeName: lang.hitch(obj, obj.setStudentNodeName)
	};

	// Execute the constructor
	obj.constructor.apply(obj, arguments);

	return obj;
    
    };

});
