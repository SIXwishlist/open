localStorage['onFormSion']=0;
ht="http://open.subinsb.com";
window.clog=function(e){ // For Debugging
 return console.log(e);
};
window.sChecks={
 "init" : function(extra, isInterval){
  var data={
   "u"   : $("#name_button").attr("rid"),
   "p"   : $(".post:first").attr("id"),
   "cu"  : encodeURIComponent(window.location.href),
   "pt"  : $("meta[name=type]").attr("value")
  };
  if(typeof isInterval == "undefined" && typeof sChecks.nc=="undefined"){
   sChecks.nc=sChecks.normalCheck();
  }else if(typeof isInterval != "undefined" && isInterval!="normal"){
   window.clearInterval(sChecks.nc);
  }
  wholeJSON=$.extend(sChecks.removeUD(extra), sChecks.removeUD(data));
  var intSt=sChecks.interval(wholeJSON, function(){});
 },
 "interval" : function(wholeJSON, c){
  $.post(ht+"/ajax/check", wholeJSON, function(){c();}, "script").error(function(){
   c();
  });   
 },
 "normalCheck" : function(){
  return setInterval(function(){
   sChecks.init({}, "normal");
  }, 15000);
 },
 "removeUD" : function(wholeJSON){
  if(typeof wholeJSON=="object" && wholeJSON.length!=0){
   $.each(wholeJSON, function(i, elem){
    if(typeof wholeJSON[i]=="undefined"){
     wholeJSON[i]="undefined";
    }else if(typeof wholeJSON[i]=="object"){
     $.each(wholeJSON[i], function(i2, elem2){
      if(typeof wholeJSON[i][i2]=="undefined"){
       wholeJSON[i][i2]="undefined";
      }
     });
    }
   });
  }
  return wholeJSON;
 }
}
if(typeof $("#name_button").attr("rid")!="undefined"){
 sChecks.init();
}
window.filt=function($msg,$f){
 $msg=$msg.replace(/\</g,'&lt;');
 $msg=$msg.replace(/\>/g,'&gt;');
 $msg=$msg.replace(/\//g,'\/');
 /*if($f===true){
  *///$msg=$msg.replace(/\*\*(.*?)\*\*/g,'<b>$1</b>');
  /*$msg=$msg.replace(/"/g,'\"');
  *///$msg=$msg.replace(/\*\/(.*?)\/\*/g,'<i>$1</i>');
  /*$msg=$msg.replace(RegExp('((www|http://)[^ ]+)','g'), '<a target="_blank" href="http://open.subinsb.com/url?url=$1">$1</a>');
  $msg=$msg.replace("\n","<br/>");
  $msg=$msg.replace(RegExp('(\#[^ ]+)','g'),'<a href="http://open.subinsb.com/search?q=$1">$1</a>');
  $msg=$msg.replace("http://open.subinsb.com/search?q=#","http://open.subinsb.com/search?q=%23");
 }*/
 return $msg;
};
window.msg=function(m,t){
 if(m=='' && t=='e'){m="Failed To Do Task";}
 if(m=='' && (t=='s' || t=='')){m="Task Completed Successfully";}
 if(m=='' && t=='m'){m="Doing Task";}
 whb=t=='e' ? "red":"rgb(100, 194, 53)";
 if(t=="m"){whb="rgb(218, 208, 101)";m+="....";}
 if($("#notify_panel").length==0){
  $("body").append("<div id='notify_panel' style='padding:5px 20px;position:fixed;left:50px;bottom:100px;border:1px solid black;border-radius:5px;color:white;display:none;cursor:pointer;z-index:2014;font-size: 14px;max-width:150px;' title='Click To Close Dialog'></div>");
 }
 $("#notify_panel").css("background",whb);
 $("#notify_panel").html(filt(m));
 $("#notify_panel").fadeIn("2000");
 if(t!="m"){
  setTimeout(function(){
   $("#notify_panel").fadeOut("2000");
  },5000);
 }
 $("#notify_panel").live("click",function(){
  $(this).fadeOut("2000");
 });
};
window.dialog=function(u, t){
 if($("#dialog").length==0){
  $("body").append("<div id='dialog'><div id='content'></div></div>");
  $("#dialog #close").live("click",function(){
   $("#dialog").hide();
  });
  $("#dialog").live("click", function(e){
   if(!$("#dialog #content").is(e.target) && !$("#dialog #content").has(e.target)){
    $("#dialog").hide();
   }
  });
  $(window).live("keyup",function(e){
   clog(e);
   if(e.keyCode==27){
    $("#dialog").hide();
   }
  });
 }
 $(".content").trigger("mouseup");// Close all dialogs with .c_c
 $("#dialog").show();
 if(typeof t=="undefined"){
  msg("Loading","m");
  if($("#dialog #content iframe").attr("src")!=u){
   $("#dialog #content").html("<iframe src='"+u+"' onload='msg(\"Loaded\")' height='100%' width='100%'></iframe><div id='close'>X</div>");
  }else{
   msg("Loaded");
  }
 }else{
  $("#dialog #content").html("<div style='margin:5px;'>"+u+"</div><div id='close'>X</div>");
 }
};
$("#name_button").live("click",function(){
 $("#short_profile").toggle();
});
window.post=function(u,dt,s,e,w,t){
 d={succ:"Task Completed",err:"Task Failed."};
 if(s!=null){d.succ=s;}
 if(e!=null){d.err=e;}
 if(w!=null){msg(w,"m");}
 if(u.match("ajax")){klo="/";}else{klo="/ajax/";}
 localStorage['onFormSion']=1;
 u=ht+klo+u;
 $.post(u,dt,function(da){
  localStorage['onFormSion']=0;
  if(da.match("{\"error")){
   var jda=JSON.parse(da);
   msg(jda.msg,"e");
  }else{
   eval(da);
   msg(d.succ);
   if(t){
    t[0].reset();
   }
  }
 },"text").error(function(){
  msg(d.err,"e");
 });
};
$(".ajax_form").live('submit',function(e){
 e.preventDefault();
 t=$(this);
 if($("#aj_res").length==0){$("body").append("<div id='aj_res' hide></div>");}
 d={succ:"",err:""};
 if(t.attr("succ")!=null){d.succ=t.attr("succ");}
 if(t.attr("err")!=null){d.err=t.attr("err");}
 post(t.attr("action"),t.serialize(),d.succ,d.err,t.attr("while"),t);
});
$(document).mouseup(function (e){
 $(".c_c").each(function(i){
  if(!$(this).is(e.target) && $(this).has(e.target).length === 0){
   $(this).hide();
  }
 });
});
$(".follow").live('click',function(){
 var id=$(this).attr("id");
 post("follow",{id:id},"Followed","Following Failed","Following");
});
$(".unfollow").live('click',function(){
 var id=$(this).attr("id");
 post("follow",{id:id},"UnFollowed","UnFollowing Failed","UnFollowing");
});
$("#change_picture").live("click",function(){
 dialog(ht+"/inc/profile_pic");
});
window.scrollTo=function(top){
 $('html, body').animate({
  scrollTop: parseFloat(top) - ($("header").height() + 5 )
 }, 1000);
};
window.tURL=function(t){
 t.find("a[href]").die("mousedown").live("mousedown",function(){
  url=$(this).attr("href");
  if(/open\.subinsb\.com/.test(url)==false){
   url="http://open.subinsb.com/url?url="+encodeURIComponent(url);
   $(this).attr("href",url);
   $(this).attr("target","_blank");
  }
 });
};
$("#nfn_button").live("click",function(){
 if($(".notifications .nfs .nfsi").length==0 || $(".notifications #nfn_button").text()!="0"){
  $(".notifications .loading").show();
 }
 if($(".notifications #nfn").is(":hidden")){
  post("ajax/nfs",{load:1});
  $(".notifications #nfn").show();
 }else{$(".notifications #nfn").hide();}
});
