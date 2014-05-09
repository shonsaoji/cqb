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

	//$("#right_panel").resizable();
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
	}
	];
	this.tableList = [];

	this.init = function() {
		//this.element.html("<div id='table_list' ></div><div id='er-diagram' class='er-diagram'><h1>Drag Tables Here</h1></div>");
		this.element.html("<div id='table_panel' class='panel-default'><div class='panel-heading'>Table List</div><div id='table_list' class='panel-body '></div></div><div id='right_panel'class='panel-default'><div id = 'er_panel' class='innerPanel panel-default'><div class='panel-heading'>Query Builder</div><div id='er-diagram' class='er-diagram panel-body'><h1>Drag Tables Here</h1></div></div><div id = 'output_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div><div id = 'query_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div></div>");
		
		this.tableList = new TableList({
			element: "table_list",
			tables: this.tables_list,
			container_class: "table"
		});
		this.erDiagram = new ERDiagram();		
		this.tableList.draw();
		
		this.erDiagram.draw();
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
		for(var i = 0; i < this.tables_list.length; i++) {
			var table_name_elem = $("#" + this.tables_list[i].name);
			table_name_elem.draggable({ revert: true });			
		}		

		var er_elem = $("#er-diagram");
		er_elem.find(".draggable").draggable();
		$("#er-diagram").droppable({
			drop: function( event, ui ) {
		    	
		    }
		});
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
			html += "<div class='" + this.cell_class + "' id='" + this.tables[i].name + "'>" + this.tables[i].name + " </div>";
		}

		$(this.cell_class).removeClass("table-container");
		if(!this.element.hasClass(this.container_class)) {
			this.element.addClass(this.container_class);
		}
		this.element.html(html);		
	};
};


function ERDiagram() {
	this.tables = [
	{
		name: "customers",
		fields: ["customer_id", "name", "address"]
	},
	{
		name: "orders",
		fields: ["order_id", "customer_id", "total"],
	}
	];

	this.draw = function() {
		var elem = $("#er-diagram"),
		html = "";
		for(var i = 0; i < this.tables.length; i++) {
			html += "<div class='table-container draggable' style=\"left: " + i*75 + "\">" + this.tables[i].name;
			for(var j = 0; j < this.tables[i].fields.length; j++) {
				html += "<div class='table-cell'>" ;
				html += "<input type=checkbox value='" + this.tables[i].fields[j] + "' />&nbsp;";
				html += this.tables[i].fields[j] ;
				html += "</div>";
			}
			
			html += "</div>";
		}
		elem.html(html);
	};
}