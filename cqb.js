//jsPlumb.ready(function() {
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


  
 // end of jsplumb

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
        });                                 // helper: "clone "  behaves like revert
    }   

    var er_elem = $("#er-diagram");
    $("#er-diagram").droppable({
      drop: function( event, ui ) {
          var tablename = $(ui.draggable).attr('id');
           if($.inArray(tablename, erdiagram.tables_in_diagram)<0 )       // checking whether tablename exists in tables_in_diagram array
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

    
  /*  er_elem.find(".table-cell").draggable({
      helper: "clone"
    });
    er_elem.find(".table-cell").droppable({     
      hoverClass: "droppable-hover",
      drop: function( event, ui ) {
          alert(ui.draggable.text() + " dropped into " + this.textContent);
        }
    });          */
  }

};                       // end of cqb function

function TableList(opts) { 
  
  this.elementId = opts.element;

      this.element = $("#" + this.elementId);

  this.tables = opts.tables;

  this.container_class = opts.container_class || "table-container";


this.cell_class = opts.cell_class || "table-cell";                       //this.cell_class="table-cell"


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

  var draggableId;
  var droppableId;
  var con;
  var store1_con,store2_con,store3_con,store4_con,store5_con;
        var i=0;

        var arr=[];
        var arrr=[];
        var data=[];
      
         var k=0,l=0;
         var drag=[]; var inc1=0; var inc2=0;
         var drop=[];


         var inc=0;


         var tablee=[]; 
    
  this.removeTable = function(uiId, table_name)
  {


      $(uiId).remove();

      var index = $.inArray(table_name,this.tables_in_diagram);
      if(index>= 0)
      {
       this.tables_in_diagram.splice(index,1);
      }
  }

 

   this.display=function()
  {




  //  for(var z=0;z<3;z++)
  //  {
      //  alert($("#"+arrr[z]).val()); its working

    /*  var a= document.getElementById(arrr[z]).value;
      alert(a);   */


      
    //}


  /*   $("#"+arrr[1]).change( function(){

     if(document.getElementById(arrr[1]).checked==true)
     {
      alert("yes");
     }
    });    */

    
    var cust0=$("#customers0").find("input").val();
    var cust1=$("#customers1").find("input").val();
    var cust2=$("#customers2").find("input").val();

    var orders0=$("#orders0").find("input").val();
    var orders1=$("#orders1").find("input").val();
    var orders2=$("#orders2").find("input").val();
console.log('dskdslk')

    var employees0=$("#employees0").find("input").val();
    var employees1=$("#employees1").find("input").val();
    var employees2=$("#employees2").find("input").val();





    self.makedraggable();

     /* var check1,check2,check0;    tried to make it dynamic , will do it later
        
           for(int i=0;i<3;i++)
           {
                 check+i=$("#customers"+i).find("input").val();
                 alert(check+i);
           }     */
  }


  this.makedraggable=function()
  {
    $("#customers0").draggable({ revert: true });
    $("#customers1").draggable({ revert: true });
    $("#customers2").draggable({ revert: true });
    $("#orders0").draggable({ revert: true });
    $("#orders1").draggable({ revert: true });
    $("#orders2").draggable({ revert: true });
    $("#employees0").draggable({ revert: true });
    $("#employees1").draggable({ revert: true });
    $("#employees2").draggable({ revert: true });


    making_droppable();





  }


  function making_droppable()
  {
    $('.table-cell').droppable({ drop: Drop });

    function Drop(event, ui) {

      
      draggableId = ui.draggable.attr("id");

              droppableId = $(this).attr("id");

             self.connections();

          // self.remove_first_connection();



    }


  }


  

         this.connections=function()
         {
         
          //   alert(draggableId);
         //   alert(droppableId);

                  con = jqSimpleConnect.connect("#"+draggableId, "#"+droppableId, {radius: 4, color: 'yellow'});
                  
                   arr.push(con);

                   var node=document.createElement("div");
                   node.id="div"+i;
                   node.className="connections";
                 
                   

    // getting the division id then checkbox and its value

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



                  

                 $("#div"+i).click(function(){

                          var a=node.id;
                       
                              var j =  a[3];


                         jqSimpleConnect.removeConnection(arr[j]);
                          delete arr[j];
                          delete drag[j];
                           delete drop[j];

                          var parent= document.getElementById('table_panel');
                          var child =document.getElementById("div"+j);
                          parent.removeChild(child);
                


                 });

                 i++; 





           

                  
}





                         



    



         setInterval(function() {


         //  jqSimpleConnect.repaintConnection(con);
                      
            jqSimpleConnect.repaintConnection(store1_con);
            jqSimpleConnect.repaintConnection(store2_con); 
            jqSimpleConnect.repaintConnection(store3_con);           
          
             
            jqSimpleConnect.repaintAll();                    // we can directly use this method

        });


       





  this.append_table = function(table)
  {



    var elem = $("#er-diagram");
    //var html = elem.html();
    if(table)
    {
      var html = " ";

             html +="<input type='hidden' id='hid"+inc+"' value='"+table.name+"'>"


      html += "<div class='table-container draggable ' id='"+table.name+"_table' value="+table.name+">" + table.name + "<span style='float: right; padding-right: 2px; cursor:pointer;position: relative;' id = '"+table.name+"'  class = 'remove-table  glyphicon glyphicon-remove'></span>";
      for(var j = 0; j < table.fields.length; j++) {
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
    
   

       inc++;


                 

    /* for(var j = 0; j < table.fields.length; j++) {
          
                              $("#"+table.name+""+j+""+j).change( function(){
                                   
                                   var bb=$(customers00).val();
                                   var aa= $("#"+table.name+j+j).val();
                               console.log(aa);
                                  });
                       }  */

    
                   
                

  /*  $( "#customers0" ).dblclick(function() {
                    alert( "suraj" );
                         
                         });        just to check if the double click event will be triggered and yes it does      */  

             

        self.display();

          




          

        elem.find(".draggable").draggable();
    this.tables_in_diagram.push(table.name);
    console.log(this.tables_in_diagram);
   
    elem.find(".remove-table").click(function(){

     
      self.removeTable("#"+this.id+"_table", this.id);

        

    });

    }

                 

                          


  }



/*  this.draw = function(tablename) {
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
        html += "<div class='table-cell' >" ;               // i have changed it 
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
  };  */


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



    for(var i=0;i<table_ids.length - 1;i++){
      query += " LEFTJOIN " + table_ids[i+1] + " ON " + dragg_dropp[i] ;
    }

    query_panel.innerHTML +=query ;

})
     

 /*  $( "#data2" ).click(function() {


             add.innerHTML="";
              var checkedd=[];
               var tab_name=" ";
               var drag_drop="";
               var check_name="";
               var total="";
               var pt=0;
               
          //    query_panel.innerHTML +="suraj";
    
        
           
             var tab_length=tablee.length;
          
            

   

            

var checked_length=arrr.length;

           
                 
    for(var l=0;l<checked_length;l++)
    {

      if(document.getElementById(arrr[l]).checked==true)
                        {
                          

                          var parent=$("#" + arrr[l]+"").parent().attr("id");
                          var parent1=$("#" + parent+"").parent().attr("id");


                           var res=document.getElementById(parent1).getAttribute('value');   // customers

                          

                         checkedd[pt]=res+"."+document.getElementById(arrr[l]).value;
                            
                             pt++;   

                       

                       
               
                        }


             }


      for(var i=0;i<checkedd.length;i++)
      {
       
            check_name =check_name+checkedd[i]+ ",";
      }


            var a1=check_name.lastIndexOf(check_name.slice(-1));

                  String.prototype.replaceAt=function(index, character) {
                   return this.substr(0, index) + character + this.substr(index+character.length);
                                    }

                   var b1= check_name.replaceAt(a1,"  ");   





     
           add.innerHTML =b1;

           query_panel.innerHTML="";

        query_panel.innerHTML +="select "+add.innerHTML + " from";

    var len1=drag.length;

    tab_name=tab_name+tablee[0]
console.log('hello');
    for(var i=0;i<tablee.length - 1;i++)
    {

    tab_name=tab_name + " LEFTJOIN " + tablee[i+1] + " ON " + drag[i] + "=" +  drop[i] ;

    }

    query_panel.innerHTML +=tab_name ;

    var b5;     

    // var a4=tab_name.lastIndexOf("LEFTJOIN");
    // var b4=tab_name.replaceAt(a4 , "            ");

    // var a2=b4.lastIndexOf(tab_name.slice(-1));
    // var b2=b4.replaceAt(a2,"  ");  

    // if(tab_length==3)
    // {

    // var a5=b2.lastIndexOf("LEFTJOIN");
    // b5=b2.replaceAt(a5,"                    ");

    // } 

    // add.innerHTML =b5;  

    // query_panel.innerHTML +=add.innerHTML + " ON ";


    // alert(len1);


    // for(var i=0;i<len1;i++)
    // {
    // //  alert(drag[i]+"="+dro  p[i]);
    // }




    // for(var m=0;m<len1;m++)
    // {

    // drag_drop=drag_drop+" "+drag[m]+"=";
    // drag_drop=drag_drop+" "+drop[m]+ ",";

    // }


    // var res3=drag_drop;

 //var res3;

// for(var i=0;i<len1;i++)
// {
           
//   if(res3.indexOf("undefined") != -1){
    
//    // add.replace('undefined,','');

  
//    var res = res3.replace("undefined=", " ");
   
//    res3=res.replace("undefined,"," ");



//    }

//  }


//  var p=res3;

// for(var i=0;i<len1;i++)
// {
//  p= p.replace(",", " and ");


// }


//                   var a3=p.lastIndexOf("and");

//                   var b3= p.replaceAt(a3," ; ");  


              
//                var  b6=b3.replace("and","LEFTJOIN "+" "+tablee[2]+" ON ");

             


//   add.innerHTML =b6 ;

//   query_panel.innerHTML +=tab_name ;

//  var z=query_panel.innerHTML;

// // if(z.indexOf(",") !=-1)


//   add.innerHTML="";

  }); */

  


}

