
$(document).ready(function(){

 
  
            var cqb = new CQB({elementId: "cqb_container"});
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

      function CQB(opts) 
       {

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
  
            this.init = function() 
            {
              this.element.html("<div id='table_panel' class='panel-default'><div class='panel-heading'>Table List</div><div id='table_accordian' class=''></div><br/><br/><br/><div class='panel-heading'>Connections :</div></div><div id='right_panel'class='panel-default'><div id = 'er_panel' class='innerPanel panel-default'><div class='panel-heading'>Query Builder</div><div id='er-diagram' class='er-diagram panel-body'><h6>Drag Tables Here</h6></div></div><div id = 'output_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div><div id = 'query_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div></div>");
              
              this.tableList = new TableList({
                element: "table_accordian",
                tables: this.tables_list,
                container_class: "table_accordian"
              });
              this.erDiagram = new ERDiagram({
                tables: this.tables_list
              }); 


              this.tableList.draw();
              
           
              this.attachEvents();

           };




        this.get_fields_for_table = function(table_name) 
        {

            for(var i=0;i<this.tables_list.length;i++)
            {


                  if(this.tables_list[i].name == table_name)
                  {
                    var table = this.tables_list[i];

                  }
            }

            if(table) 
            {
              return table;
            }
        };



        this.attachEvents = function() 
        {

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
            drop: function( event, ui ) 
            {
                var tablename = $(ui.draggable).attr('id');
                 if($.inArray(tablename, erdiagram.tables_in_diagram)<0 )      
                 {
                  var table = self_cqb.get_fields_for_table(tablename);
                  console.log(table);
                  erdiagram.append_table(table);
                 }
                else 
                 {
                  alert("Table "+tablename+" alredy present in Query Builder");
                 }
            }
          });

          
       
        }

  };                       
      

      function TableList(opts) 
      { 
        
        this.elementId = opts.element;

            this.element = $("#" + this.elementId);

        this.tables = opts.tables;

        this.container_class = opts.container_class || "table-container";


      this.cell_class = opts.cell_class || "table-cell";                       


        this.draw = function() 
        {
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
          if(!this.element.hasClass(this.container_class)) 
          {
            this.element.addClass(this.container_class);
          }
          this.element.html(html);    
        };

      };


function ERDiagram(opts) 
{
  
    this.tables = opts.tables;
    this.tables_in_diagram = [];
    
    var self = this;

    var draggableId;
    var droppableId;
    var con;var i=0;var inc=0;var tablee=[]; 
    var arr=[]; var arrr=[];var data=[];
    var k=0,l=0;var drag=[]; var inc1=0; var inc2=0;var drop=[];

      this.removeTable = function(uiId, table_name)
      {

        $(uiId).remove();

              var index = $.inArray(table_name,this.tables_in_diagram);
              if(index>= 0)
              {
               this.tables_in_diagram.splice(index,1);
              }
            
           var length=arr.length;
             

           for(var i=0;i<length;i++)
           {
              
             

              if(((drag[i].substring(0,3))==table_name.substring(0,3))||((drop[i].substring(0,3))==table_name.substring(0,3)))
              {

                 jqSimpleConnect.removeConnection(arr[i]);
                 delete(arr[i]);
                delete(drag[i]);
                delete(drop[i]);
                drag[i]="zzz";
                drop[i]="zzz";
                

                 var parent= document.getElementById('table_panel');
                var child =document.getElementById("div"+i);
                 parent.removeChild(child);
              }

           
           }
          
      }

 
      this.makedraggable=function(namess)
      {

           for(var i=0;i<3;i++)
           {
              $("#"+namess+i).draggable({ revert: true });
           }
            

        making_droppable();
    }


  function making_droppable()
  {

    $('.table-cell').droppable({ drop: Drop });

          function Drop(event, ui) 

          {

              draggableId = ui.draggable.attr("id");

              droppableId = $(this).attr("id");

              self.connections();

          }


  }


  

         this.connections=function()
         {
         
             con = jqSimpleConnect.connect("#"+draggableId, "#"+droppableId, {radius: 4, color: 'yellow'});
                  
              arr.push(con);

                   var node=document.createElement("div");
                   node.id="div"+i;
                   node.className="connections";
                 
           
                var aa= $("#" + draggableId+"").find("input").val();            // customer_id
                var bb= $("#" + droppableId+"").find("input").val();


                var parent1=$("#" + draggableId+"").parent().attr("id");          // customers_table
                var parent2=$("#" + droppableId+"").parent().attr("id");


                var res1=document.getElementById(parent1).getAttribute('value');       // customers
                var res2=document.getElementById(parent2).getAttribute('value'); 
          
                   var textnode=document.createTextNode(res1+"."+aa +" = "+res2+"."+bb);
                   node.appendChild(textnode);
                   document.getElementById("table_panel").appendChild(node);
                    var br = document.createElement("br");
                   document.getElementById("table_panel").appendChild(br); 

                   drag.push(res1+"."+aa);
                   drop.push(res2+"."+bb);

                 $("#div"+i).click(function()
                 {

                          var a=node.id;
                       
                              var j =  a[3];


                         jqSimpleConnect.removeConnection(arr[j]);
                          delete arr[j];
                          delete drag[j];
                          delete drop[j];

                          drag[j]="zzz";
                          drop[j]="zzz";

                          var parent= document.getElementById('table_panel');
                          var child =document.getElementById("div"+j);
                          parent.removeChild(child);
                


                 });

                 i++; 
        
      }

         setInterval(function() 

         {

           jqSimpleConnect.repaintAll();                    // we can directly use this method

         });

  this.append_table = function(table)
  {



    var elem = $("#er-diagram");
   
             if(table)
            {
                  var html = " ";

                         html +="<input type='hidden' id='hid"+inc+"' value='"+table.name+"'>"


                  html += "<div class='table-container draggable ' id='"+table.name+"_table' value="+table.name+">" + table.name + "<span style='float: right; padding-right: 2px; cursor:pointer;position: relative;' id = '"+table.name+"'  class = 'remove-table  glyphicon glyphicon-remove'></span>";
                        
                        for(var j = 0; j < table.fields.length; j++) 
                        {
                          html += "<div class='table-cell' id='"+table.name+""+j+"' value='"+table.fields[j]+"'>" ;   // i have changed this
                          html += "<input type=checkbox value='" + table.fields[j] + "' id='"+table.name+""+j+""+j+"'/>&nbsp;";
                          html += table.fields[j] ;
                          html += "</div>";

                         arrr[k]=table.name+""+j+""+j;
                                            
                                             

                                              k++;


                        }
                           

            html += "</div>";
            elem.append(html);
            tablee[inc]=document.getElementById("hid"+inc).value;
             self.makedraggable(tablee[inc]);
           
           
           

           elem.find(".draggable").draggable();
          this.tables_in_diagram.push(table.name);
          console.log(this.tables_in_diagram);
         
              elem.find("#"+table.name).click(function()
              {
                var a=$("#"+table.name).attr('id');
               
                self.removeTable("#"+a+"_table", a);
             });

            inc++;

          }

    }








      $( "#data" ).click(function() {
        
          query_panel.innerHTML = " ";

           var table_ids = [];
           var tabss=[];

                $("#er-diagram").find('.table-container').each(function(i,t){

                     $(t).find('span').each(function(m,c)
                      {
                               table_ids.push(c.id);
                      });


                     $(t).each(function(n,d)
                     {
                           tabss.push(d.id);
                     });
                });



          

          var cell_ids  = [];

             $(tabss).each(function(i,tb){    
                  $("#"+tb).find(".table-cell").each(function(j, cell){
                      if($(cell).find('input')[0].checked){
                        cell_ids.push($(this).parent()[0].getAttribute("value")+"."+$(cell).find('input')[0].value);
                      };
                  });
              });




       var dragg_dropp=[];

              $(".connections").each(function(k,v)
              {
                dragg_dropp.push($(v)[0].innerText);
              });
          

          var query = "";

          query +="select "+ cell_ids + " from  ";

          query += table_ids[0];



              for(var i=0;i<table_ids.length - 1;i++)
              {
                query += " LEFTJOIN " + table_ids[i+1] + " ON " + dragg_dropp[i] ;
              }

          query_panel.innerHTML +=query ;

      })
     
}

