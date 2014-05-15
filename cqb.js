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

	$("#table_accordian").accordion({
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
		this.element.html("<div id='table_panel' class='panel-default'><div class='panel-heading'>Table List</div><div id='table_accordian' class=''></div></div><div id='right_panel'class='panel-default'><div id = 'er_panel' class='innerPanel panel-default'><div class='panel-heading'>Query Builder</div><div id='er-diagram' class='er-diagram panel-body'><h6>Drag Tables Here</h6></div></div><div id = 'output_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div><div id = 'query_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div></div>");
		
		this.tableList = new TableList({
			element: "table_accordian",
			tables: this.tables_list,
			container_class: "table_accordian"
		});
		this.erDiagram = new ERDiagram({
			tables: this.tables_list
		});		
		this.tableList.draw();
		
		//this.erDiagram.draw();
		this.attachEvents();

	 

	};

	this.get_fields_for_table = function(table_name) {
		for(var i=0;i<this.tables_list.length;i++)
		{
			if(this.tables_list[i].name == table_name)
			{
				var table = this.tables_list[i];
			}
		}
		if(table) {
			return table;
		}
	};

	this.attachEvents = function() {

		var erdiagram = this.erDiagram;
		var self_cqb = this;

		for(var i = 0; i < this.tables_list.length; i++) {
			var table_name_elem = $("#" + this.tables_list[i].name);
		
			table_name_elem.draggable({ helper:"clone" ,
					drag: function(){
					}
				});			
		}		

		var er_elem = $("#er-diagram");
		$("#er-diagram").droppable({
			drop: function( event, ui ) {
		    	var tablename = $(ui.draggable).attr('id');
		    	 if($.inArray(tablename, erdiagram.tables_in_diagram)<0 )
		    	 {
		    	 	var table = self_cqb.get_fields_for_table(tablename);
		    	 	console.log(table);
		    	 	erdiagram.append_table(table);

		    		//erdiagram.draw(tablename);
		    	}else {
		    		alert("Table "+tablename+" alredy present in Query Builder");
		    		
		    	}
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

	this.tables = opts.tables;
	this.container_class = opts.container_class || "table-container";
	this.cell_class = opts.cell_class || "table-cell";
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

	this.tables_in_diagram = [];
	var self = this;

	this.removeTable = function(uiId, table_name)
	{
			$(uiId).remove();
			var index = $.inArray(table_name,this.tables_in_diagram);
			if(index>= 0)
			{
			 this.tables_in_diagram.splice(index,1);
			}
	}

	this.append_table = function(table)
	{
		var elem = $("#er-diagram");
		//var html = elem.html();
		if(table)
		{
			var html = " ";
			html += "<div class='table-container draggable ' id='"+table.name+"_table' >" + table.name + "<span style='float: right; padding-right: 2px; cursor:pointer;position: relative;' id = '"+table.name+"'  class = 'remove-table  glyphicon glyphicon-remove'></span>";
			for(var j = 0; j < table.fields.length; j++) {
				html += "<div class='table-cell'>" ;
				html += "<input type=checkbox value='" + table.fields[j] + "' />&nbsp;";
				html += table.fields[j] ;
				html += "</div>";
			}
			
			html += "</div>";
		
		elem.append(html);
		elem.find(".draggable").draggable();
		this.tables_in_diagram.push(table.name);
		console.log(this.tables_in_diagram);
		elem.find(".remove-table").click(function(){
			self.removeTable("#"+this.id+"_table", this.id);
		});
		}

	}

	this.draw = function(tablename) {
		var elem = $("#er-diagram");

		for(var i=0;i<this.tables.length;i++)
		{
			if(this.tables[i].name == tablename)
			{
				var table = this.tables[i];
			}
		}
		if(table) {
	
		var html = " ";
			html += "<div class='table-container draggable ' id='"+tablename+"_table' >" + tablename + "<span style='float: right; padding-right: 2px; cursor:pointer;position: relative;' id = '"+tablename+"'  class = 'remove-table  glyphicon glyphicon-remove'></span>";
			for(var j = 0; j < table.fields.length; j++) {
				html += "<div class='table-cell'>" ;
				html += "<input type=checkbox value='" + table.fields[j] + "' />&nbsp;";
				html += table.fields[j] ;
				html += "</div>";
			}
			
			html += "</div>";
		
		elem.append(html);
		elem.find(".draggable").draggable();
		this.tables_in_diagram.push(tablename);
		console.log(this.tables_in_diagram);
		elem.find(".remove-table").click(function(){
			self.removeTable("#"+this.id+"_table", this.id);
		});
	}
	};
}