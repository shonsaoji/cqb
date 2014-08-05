
$(document).ready(function(){

 
  
       var cqb = new CQB({elementId: "cqb_container"});
       cqb.init();
     
  $("#right_panel").outerWidth($("#cqb_container").innerWidth()- $("#table_panel").outerWidth(true)-1);
  $("#right_panel").outerHeight($("#cqb_container").innerHeight());
//  $("#output_panel").outerHeight($("#right_panel").innerHeight()/3);
  $("#query_panel").outerHeight($("#right_panel").innerHeight()/3);
  $("#er_panel").outerHeight($("#right_panel").innerHeight()/1.5);
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
              fields: ["order_id", "customer_id", "total"]
            },
            {
              name:"employees",
              fields: ["emplyee_id","name","adress"]
            },
            {
              name: "data_sources",
              fields: ["id", "name", "display_name","load_count","is_enabled","fields_str","dimension_str"]
            },
            {
              name: "dimensions",
              fields: ["id", "field_name", "form at_as","display_name","unit","rank","charts_id"],
            },
            {
              name:"measures",
              fields: ["id", "field_name", "form at_as","display_name","unit","field_type","charts_id","is_calculated"],
            },
            {
              name: "user_color_pref",
              fields: ["id", "color_palette", "bar_color","line_color","area_color","error_bar_color","ctrl_key_color","stat_rel_color","users_id"]
            },
            {
              name: "charts_data_src",
              fields: ["data_sources", "charts_id", "count"],
            },
            {
              name:"charts",
              fields: ["id","title","subtitle","width","heigth","margin-left","margin-right","margin-top","margin-bottom","configs","modal_enabled","modal_title"],
            },
             {
              name: "users",
              fields: ["id", "first_name", "last_name","is_admin","email","password"],
            },
            {
              name:"charts_usr",
              fields: ["id","width","heigth","users_id","charts_id"],
            }
            ];
            this.tableList = [];
  
            this.init = function() 
            {
              this.element.html("<div id='table_panel' class='panel-default'><div class='panel-heading'>Table List</div><div id='table_accordian' class=''></div><br/><br/><br/><div class='panel-heading'>Connections :</div></div><div id='right_panel'class='panel-default'><div id = 'er_panel' class='innerPanel panel-default'><div class='panel-heading'>Query Builder <select id='joins'><option value='JOINS U CAN APPLY'>JOINS U CAN APPLY</option> <option value='LEFT_JOIN'>LEFT JOIN</option><option value='RIGHT_JOIN'>RIGHT JOIN</option><option value='INNER_JOIN'>INNER JOIN</option></select></div><div id='er-diagram' class='er-diagram panel-body'><h6>Drag Tables Here</h6></div></div><div id = 'query_panel'class='innerPanel panel-default'><div class='panel-heading'>Query</div></div></div>");
              
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

          for(var i = 0; i < this.tables_list.length; i++) 
                {
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

          for(var i = 0; i < this.tables.length; i++) 
          {
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
    var id=[];
    var draggableId;
    var droppableId;
    var con;var i=0;var inc=0;var tablee=[]; 
    var conn_array=[]; var data=[]; var stretch_from=[];var stretch_to=[];
    var k=0,l=0;var drag=[]; var inc1=0; var inc2=0;var drop=[];
     var ress1;var ress2,value,value1;
     var drag_column=[],drop_column=[];

      this.removeTable = function(uiId, table_name)                        // removing the tables and the attached connections
      {

        $(uiId).remove();

              var index = $.inArray(table_name,this.tables_in_diagram);

              if(index>= 0)
              {
               this.tables_in_diagram.splice(index,1);
              }
            
           var length=conn_array.length;
             

           for(var i=0;i<length;i++)
           {
              
             

              if(((drag[i].substring(0,3))==table_name.substring(0,3))||((drop[i].substring(0,3))==table_name.substring(0,3)))
              {

                 jqSimpleConnect.removeConnection(conn_array[i]);
                 delete(conn_array[i]);
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


      this.scrolll=function()
      {
        $( window ).scroll(function() {

               jqSimpleConnect.repaintAll();  

            })


        $("#er_panel").scroll(function()
        {
           jqSimpleConnect.repaintAll();  
        })

        $("#er-diagram").scroll(function()
        {
          jqSimpleConnect.repaintAll();
        })
      

 }
      this.makedraggable=function(namess,length)                                // to make the elements draggable and also repaint the connections
      {

         
           $("#"+namess+"_table").draggable();

           $( "#"+namess+"_table").on( "dragstop", function( event, ui ) { 


                 
                       for(var i=0;i<conn_array.length;i++)
                       {
                         if((stretch_from[i]==namess)||(stretch_to[i]==namess))
                         {
                                jqSimpleConnect.repaintConnection(conn_array[i]);
                         }
                       }

             });

       
   
           for(var i=0;i<length;i++)
           {
              $("#"+namess+i).draggable({ revert: true });
      
           }
            


        making_droppable();
      }


  function making_droppable()                                            // to make the elements droppable
  {



    $('.table-cell').droppable({ drop: Drop });

          function Drop(event, ui) 

          {

              draggableId = ui.draggable.attr("id");

              droppableId = $(this).attr("id");
console.log(droppableId)
              self.connections();

          }


    }



  

         this.connections=function()                                          // for making connections and creating a div for deletion
         {
         
         

             con = jqSimpleConnect.connect("#"+draggableId, "#"+droppableId, {radius: 4, color: 'Gray'});

             $("#"+draggableId).append("  <a href='#' id='"+draggableId+"popover' class='pops'>&nbsp &nbsp&nbsp <span class='edit_connection glyphicon glyphicon-edit form-control-feedback'></span></a>");
             $("#"+droppableId).append("  <a href='#' id='"+droppableId+"popover'>&nbsp &nbsp&nbsp <span class='edit_connection glyphicon glyphicon-edit form-control-feedback'></span></a>");
            


                 drag_column.push($("#" + draggableId+"").find("input").val());            // customer_id
                 drop_column.push($("#" + droppableId+"").find("input").val());
         
                var parentt1=$("#" + draggableId+"").parent().attr("id");          // customers_table
             
                 ress1=document.getElementById(parentt1).getAttribute('value');       // customers
 
                 var parentt2=$("#" + droppableId+"").parent().attr("id");
                  ress2=document.getElementById(parentt2).getAttribute('value');


                $("#right_panel").append("<div id='"+droppableId+"popoverr' class='pop_box' style='display: none'>"+ress1+"<p><br></p><select id='firstt'><option value='Type of join'>Type of join</option><option value='left_join'>LEFT_JOIN</option><option value='right_join'>RIGHT_JOIN</option><option value='inner_join'>INNER_JOIN</option></select><p><br></p>"+ress2+"  &nbsp &nbsp  ON <br><br> "+ress1+"."+drag_column+"<select id='compare'><option value='comparison'>comparison</option><option value='='> = </option></select>&nbsp&nbsp"+ress2+"."+drop_column+"<p><br></p> <button class='text-btn' id='save' onclick='save_pop("+droppableId+")'>Save</button>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button class='text-btn1'>Cancel</button></div>")


    

        
         
             
            $("#"+droppableId+"popover").popover({
                   
                
                  placement: 'bottom',
                  html : true, 
                  content: function() {
                    return $("#"+droppableId+"popoverr").html();
                  },
                  title: function() {
                    return $("#edit").html();
                  }



              });


          


         // $(document).on('click', 'span', function () {
         //      alert(this.id);
         //     });


          // $('#right_panel').on('click','.text-btn',function () {

          //       alert(this.id)

          //        var elem = $("#"+droppableId+"popoverr");          // default popover
          //        var current = this.parentElement;   

          //        var last=current.parentElement;               // parent of save button  
          //         value = $($(current).find('select')[0]).val();
          //         value1=$($(current).find('select')[1]).val();
              
          //         var  option = elem.find('#firstt option[value="'+value+'"]');

          //          var  option1 = elem.find('#compare option[value="'+value1+'"]');

          //         $(option).attr('selected',true);
          //           $(option1).attr('selected',true);
            
          //        $("#"+droppableId+"popover").popover("hide");

                 
          //     });

           $('#right_panel').on('click','.text-btn1',function () {
                 
                 $("#"+droppableId+"popover").popover("hide");
              });



         

              conn_array.push(con);

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

                   stretch_from.push(res1);
                   stretch_to.push(res2);

                 $("#div"+i).click(function()
                 {

                              var a=node.id;
                       
                              var j =  a[3];


                         jqSimpleConnect.removeConnection(conn_array[j]);
                          delete conn_array[j];
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


           
            
     
        

  this.append_table = function(table)
  {



    var elem = $("#er-diagram");
   
             if(table)
            {

              var checkbox_array=[];var z=0;
                  var html = " ";

                         html +="<input type='hidden' id='hid"+inc+"' value='"+table.name+"'>"


                  html += "<div class='table-container draggable ' id='"+table.name+"_table' value="+table.name+">" + table.name + "<span style='float: right; padding-right: 2px; cursor:pointer;position: relative;' id = '"+table.name+"'  class = 'remove-table  glyphicon glyphicon-remove'></span>";
                        
                        for(var j = 0; j < table.fields.length; j++) 
                        {
                          html += "<div class='table-cell' id='"+table.name+""+j+"' value='"+table.fields[j]+"'>" ;   // i have changed this
                          html += "<input type=checkbox value='" + table.fields[j] + "' id='"+table.name+""+j+""+j+"'/>&nbsp;";
                          html += table.fields[j] ;
                          html += "</div>";

                         checkbox_array[z]=table.name+""+j+""+j;
                              
                                              z++;


                        }
                           

                  html += "</div>";
                  elem.append(html);
                  tablee[inc]=document.getElementById("hid"+inc).value;
                 var len_check=checkbox_array.length;
                 self.scrolll();
                 self.makedraggable(tablee[inc],len_check);
           
          
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







//  This click function will be used to generate a query


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




       // var dragg_dropp=[];

       //        $(".connections").each(function(k,v)
       //        {
       //          dragg_dropp.push($(v)[0].innerText);
       //        });
          

          var query = "";

          query +="select "+ cell_ids + " from  ";

          query += table_ids[0];

        
        

              for(var i=0;i<tablee.length - 1;i++)
              {
                query += " "+ value +" " + tablee[i+1] + " ON " + tablee[i]+"."+drag_column[i] + value1 + tablee[i+1]+"."+drop_column[i] ;
              }

          query_panel.innerHTML +="<h3 align='center'>QUERY</h3><br>"+query ;

       



      })



         


     
}
  function save_pop(d)
            {
            
               
              var elem=$(d).find('a').attr('id')+"r";

                
               var variable=$(d).find('a').attr('id');

                   var val1=$($(d).find('select')[0]).val();
                   var val11=$($(d).find('select')[1]).val();

                    var val2= $("#"+elem).find('select option[value="'+val1+'"]');
                    var val21= $("#"+elem).find('select option[value="'+val11+'"]');
                 
                //  var val2=elem.find('#firstt option[value="'+val1+'"]');

                
                 $(val2).attr('selected',true);
                  $(val21).attr('selected',true);

               $("#"+variable).popover("hide");


                // var current = this.parentElement;  



          //        var elem = $("#"+droppableId+"popoverr");          // default popover
          //        var current = this.parentElement;   

          //        var last=current.parentElement;               // parent of save button  
          //         value = $($(current).find('select')[0]).val();
          //         value1=$($(current).find('select')[1]).val();
              
          //         var  option = elem.find('#firstt option[value="'+value+'"]');

          //          var  option1 = elem.find('#compare option[value="'+value1+'"]');

          //         $(option).attr('selected',true);
          //           $(option1).attr('selected',true);
            
          //        $("#"+droppableId+"popover").popover("hide");
 

              
              
            }


         
