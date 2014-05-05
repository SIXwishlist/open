localStorage['requested']=0;
localStorage['crequested']=0;
$(".post .author_box").live("click",function(){
 $(this).find(".author_panel").toggle();
});
$(".de_post").live("click",function(){
 id=$(this).attr("id");
 cfm=confirm("Are you really sure that you want to delete this post ?");
 if(cfm==true){
  post("delete_post",{id:id},"Deleted Post","Failed To Delete Post","Deleting");
 }
});
$(".post .pst.like").live("click",function(){
 t=$(this);
 id=t.attr("id");
 co=$("#"+id+".lk.count");
 k=t.text()=="Like" ? "Unlike":"Like";
 t.text(k);
 n=t.text()=="Like" ? parseFloat(co.text())-1:parseFloat(co.text())+1;
 co.text(n);
 t.removeClass("unlike");
 t.addClass(k.toLowerCase());
 $.post(ht+"/ajax/like",{id:id}).error(function(){
  t.text(k);
  t.click();
 });
});
$(".post .cmt.like").live("click",function(){
 t=$(this);
 id=t.attr("id");
 co=$(".comments").find("#"+id+".lk.count");
 k=t.text()=="Like" ? "Unlike":"Like";
 t.text(k);
 n=t.text()=="Like" ? parseFloat(co.text())-1:parseFloat(co.text())+1;
 co.text(n);
 t.removeClass("unlike");
 t.addClass(k.toLowerCase());
 $.post(ht+"/ajax/clike",{id:id}).error(function(){
  t.text(k);
  t.click();
 });
});
$(".post .pst.cmt").live("click",function(){
 id=$(this).attr("id");
 c=$("#"+id+".comments");
 c.toggle();
 c.find(".textEditor").click();
});
$(".comment .author_cmt_box").live("click",function(){
 $(this).find(".author_cmt_panel").toggle();
});
$(".de_cmt").live("click",function(){
 id=$(this).attr("id");
 post("delete_cmt",{id:id},"Deleted Comment","Failed To Delete Comment","Deleting");
});
$(".reply_cmt").live("click",function(){
 id=$(this).attr("id");
 $("#"+id+".cmt_form").find(".textEditor").focus().val("@"+$(this).attr("data-user")+" ");
 scrollTo($("#"+id+".cmt_form").offset().top);
});
function load_more_posts(){
 var ID=$(".post:last").attr("id");
 var mVal=$("meta[name=type]").attr("value");
 t=$(".load_more_posts");
 t.find(".normal").hide();
 t.find(".loader").show();
 if(mVal=="view"){
  return false;
 }else{
  if(mVal=="profile"){
   var aer=$("meta[name=oid]").attr("value");
   var data={uid:aer,id:ID};
   if($(".noggler#feed").is(":hidden")){
    return false;
   }
  }else if(mVal=="search"){
   var query=window.location.href.split('q=')[1];
   splW=window.location.pathname.split("/");
   if(typeof query=="undefined"){
    query="";
   }else if(query.match("&")){
    query=query.split('&')[0];
   }
   if(splW.length>2){
    query=window.location.pathname.split("/")[2];
   }
   var data={"id":ID, "q":query};
  }else{
   var data={"id":ID};
  }
 }
 if(localStorage['requested']==0){
  post('load_posts', data, "Loaded Posts", "Loading Posts failed", "Loading");
  localStorage['requested']=1;
 }
}
$(window).scroll(function(){
 if($(window).scrollTop() + $(window).height() == $(document).height() && $(".post").length!=0){
  load_more_posts();
 }
});
$(".load_more_posts .normal").live("click",function(){
 load_more_posts();
});
$(".suggestions .follow").die("click").live("click",function(event){
 $(this).parents(".sugg").remove();
 $.get(ht+"/inc/suggest",function(d){
  $(".suggestions").replaceWith(d);
 });
});
$(".load_more_comments").live("click",function(){
 var ID=$(this).attr("id");
 var pd={id:ID};
 if(localStorage['crequested']==0){
  post('load_cmts', pd, "Loaded Comments", "Loading Comments failed", "Loading");
  localStorage['crequested']=1;
 }
});
$(".textEditor").smention(ht+"/ajax/get_users",{
 avatar:true,
 width:300,
 position:"below",
 cache:true
}).live("keyup",function(){
 if($(this).data("realInnerH")==null){
  $(this).data("realInnerH", $(this).innerHeight());
 }
 $(this).innerHeight($(this)[0].scrollHeight);
}).parent("form").live("submit", function(e){
 t=$(e.target);
 t.find(".textEditor").innerHeight(t.find(".textEditor").data("realInnerH"));
 t[0].reset();
});
tURL($(".post .cont"));
tURL($(".comment .cont"));
