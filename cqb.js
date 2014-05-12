jsPlumb.ready(function() {
	var cqb = new CQB({
		elementId: "cqb_container"
	});
	cqb.init();
	$("#right_panel").outerWidth($("#cqb_container").innerWidth()- $("#table_panel").outerWidth(true)-1);
	$("#right_panel").outerHeight($("#cqb_container").innerHeight());
	$("#output_panel").outerHeight($("#right_panel").innerHeight()/3);
	$("#query_panel").outerHeight($("#right_panel").innerHeight()/3);
	$("#er_panel").outerHeight($("#right_panel").innerHeight()/3);
	$("#table_panel").resizable({
		 handles: 'e',
        minWidth: '100',
        maxWidth: '350',
        resize: function() {
            var remainingSpace = $(this).parent().width() - $(this).outerWidth(),
                divTwo = $(this).next(),
                divTwoWidth = remainingSpace - (divTwo.outerWidth() - divTwo.width());
            divTwo.width(divTwoWidth);
        }

		});

	//$("#er_panel").height($("#right_panel").parent().innerHeight()-$("#output_panel").outerHeight()-$("#query_panel").outerHeight()-1);
	$("#er_panel").resizable({
		 handles: 's',
        minHeight: ($("#right_panel").innerHeight()/10),
        maxHeight: ($("#right_panel").innerHeight()/2),
        resize: function() {
            var remainingSpace = $(this).parent().height() - $(this).outerHeight()- $("#query_panel").outerHeight(),
                divTwo = $(this).next(),
                divTwoHeight = remainingSpace - (divTwo.outerHeight() - divTwo.height());
            divTwo.height(divTwoHeight);
        }

		});

	$("#accordian").accordion({
			collapsible: true,
			icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
			heightStyle: "content",
			active:false
		});


	
});

function CQB(opts) {
	this.elementId = opts.elementId;
	this.element = $("#" + this.elementId);
	this.tables_list = [
	{
		name: "customers",
		fields: ["customer_id", "name", "address"]
	},
	{
		name: "orders",
		fields: ["order_id", "customer_id", "total"],
	},
	{
		name:"employees",
		fields: ["emplyee_id","name","adress"],
	}
	];
	this.tableList = [];

	this.init = function() {
		//this.element.html("<div id='table_list' ></div><div id='er-diagram' class='er-diagram'><h1>Drag Tables Here</h1></div>");
		this.element.html("<div id='table_panel' class='panel-default'><div class='panel-heading'>Table List</div><div id='accordian' class=''></div></div><div id='right_panel'class='panel-default'><div id = 'er_panel' class='innerPanel panel-default'><div class='panel-heading'>Query Builder</div><div id='er-diagram' class='er-diagram panel-body'><h6>Drag Tables Here</h6></div></div><div id = 'output_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div><div id = 'query_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div></div>");
		
		this.tableList = new TableList({
			element: "accordian",
			tables: this.tables_list,
			container_class: "table"
		});
		// this.erDiagram = new ERDiagram({
		// 	tables: this.tables_list
		// });		
		this.tableList.draw();
		
		//this.erDiagram.draw();
		this.attachEvents();

	};

	this.get_fields_for_table = function(table_name) {
		var table = this.tables_list.find(function(d) {
			return d.name == table_name;
		});
		if(table) {
			return table[0].fields;
		}
	};

	this.attachEvents = function() {
		var erdiagram = new ERDiagram({
			tables: this.tables_list
		});
		
		for(var i = 0; i < this.tables_list.length; i++) {
			var table_name_elem = $("#" + this.tables_list[i].name);
		
			table_name_elem.draggable({ helper:"clone" ,
					drag: function(){
						//alert(this.id);
						erdiagram.setTable(this.id);
					}
				});			
		}		

		var er_elem = $("#er-diagram");
		
		$("#er-diagram").droppable({
			drop: function( event, ui ) {
		    	var tablename = erdiagram.getTable();
		    	//alert("inside droppable "+ tablename);

		    	 if(er_elem.has("#"+tablename).length<= 0)
		    	 {
		    		erdiagram.draw(tablename);
		    		//erdiagram.setTable(" ");
		    		//$("#"+tablename).draggable();
		    		console.log("after "+tablename +" "+ er_elem.has(".draggable").length);
		    	}else{
		    		//alert("Table "+tablename+" alredy present in Query Builder");
		    	}
		    }
		});

		//console.log(er_elem.has(".table-container").length);
		
		er_elem.find(".table-cell").draggable({
			helper: "clone"
		});
		er_elem.find(".table-cell").droppable({			
			hoverClass: "droppable-hover",
			drop: function( event, ui ) {
		    	alert(ui.draggable.text() + " dropped into " + this.textContent);
		    }
		});
	}

};

function TableList(opts) { 
	this.elementId = opts.element;
	this.element = $("#" + this.elementId);
	//this.element.resizable();
	
	this.tables = opts.tables;
	this.container_class = opts.container_class || "table-container";
	this.cell_class = opts.cell_class || "table-cell";
	//this.element.addClass("ui-widget-content");
	this.draw = function() {
		var html = "";
		for(var i = 0; i < this.tables.length; i++) {
			html += "<h3 id='" + this.tables[i].name + "'>"+this.tables[i].name +"</h3><div class='" + this.cell_class + "' ><ul>" ;
			for(var j=0;j<this.tables[i].fields.length;j++)
			{
				html += "<li>"+ this.tables[i].fields[j]+"</li>";
			}
			html += "</ul> </div>";
		}

		$(this.cell_class).removeClass("table-container");
		if(!this.element.hasClass(this.container_class)) {
			this.element.addClass(this.container_class);
		}
		this.element.html(html);		
	};
};


function ERDiagram(opts) {
	
	this.tables = opts.tables;

	this.get_fields_for_table = function(table_name) {
		var table = this.tables.find(function(d) {
			return d.name == table_name;
		});
		if(table) {
			return table[0].fields;
		}
	};
	this.setTable = function(table_name)
	{
		this.table = table_name;
		
	}
	this.getTable = function()
	{
		return this.table;
	}

	this.draw = function(tablename) {
		var elem = $("#er-diagram");
		
		var table = this.tables.find(function(d) {
			return d.name == tablename;
		});
		if(table) {
	
		html = " ";
			html += "<div class='table-container draggable ' id='"+tablename+"' >" + tablename;
			for(var j = 0; j < table.fields.length; j++) {
				html += "<div class='table-cell'>" ;
				html += "<input type=checkbox value='" + table.fields[j] + "' />&nbsp;";
				html += table.fields[j] ;
				html += "</div>";
			}
			
			html += "</div>";
		
		elem.append(html);
		console.log(elem.has(".draggable").length);
		elem.find(".draggable").draggable();
	}
	};
}