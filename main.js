var worker="",bundle={item_level:0,start_at:0,stop_at:10,use_proto:!1,proto_at:0,proto_price:0,enhance_skill:0,enhancer_bonus:0,laboratory_level:0,enhance_tea:0,total_bonus:0,wisdom:1,use_blessing:!1,time:0,mat_1:0,mat_2:0,mat_3:0,mat_4:0,mat_5:0,prc_1:0,prc_2:0,prc_3:0,prc_4:0,prc_5:0,coins:0,em:1},all_result={em:0,time:0,tries:0,exp:0,coins:0,used_proto:0,proto_prc:0,mat_1:0,mat_2:0,mat_3:0,mat_4:0,mat_5:0,prc_1:0,prc_2:0,prc_3:0,prc_4:0,prc_5:0,cost:0,l_cost:0,h_cost:0,total_l_cost:0,total_h_cost:0,l_cost_div:0,h_cost_div:0},avg_result={time:0,tries:0,exp:0,coins:0,used_proto:0,proto_prc:0,mat_1:0,mat_2:0,mat_3:0,mat_4:0,mat_5:0,prc_1:0,prc_2:0,prc_3:0,prc_4:0,prc_5:0,cost:0,l_cost:0,h_cost:0},sel_item_is_open=!1,enhancer_item_is_open=!1,materials=[],selected_teas=[],temp=0;function addLeadingZeros(e,t){for(var a=e.toString();a.length<t;)a="0"+a;return a}function formatTime(e){var t=Math.floor(e/31536e3),a=Math.floor(e%31536e3/86400),s=Math.floor(e%86400/3600),n=Math.floor(e%3600/60),i=Math.floor(e%60);return t>0?t<99?addLeadingZeros(t,2)+"y:"+addLeadingZeros(a,2)+"d:"+addLeadingZeros(s,2)+"h":"000y:"+addLeadingZeros(a,2)+"d:"+addLeadingZeros(s,2)+"h":a>0?addLeadingZeros(a,2)+"d:"+addLeadingZeros(s,2)+"h:"+addLeadingZeros(n,2)+"m":addLeadingZeros(s,2)+"h:"+addLeadingZeros(n,2)+"m:"+addLeadingZeros(i,2)+"s"}function update_values(){for(bundle.enhance_skill+bundle.enhance_tea>=bundle.item_level?bundle.total_bonus=1+(.05*(bundle.enhance_skill+bundle.enhance_tea+bundle.laboratory_level-bundle.item_level)+bundle.enhancer_bonus)/100:bundle.total_bonus=1-.5*(1-(bundle.enhance_skill+bundle.enhance_tea)/bundle.item_level)+(.05*bundle.laboratory_level+bundle.enhancer_bonus)/100,i=0;i<success_rate.length;i++)es=Number(success_rate[i]*bundle.total_bonus+5e-4).toFixed(2),$(".success_rate_list").find("li:eq("+i+")").text("+"+(i+1)+": +"+es+"%");$("#i_time").val((12/(1+(bundle.enhance_skill>bundle.item_level?(bundle.enhance_skill+bundle.enhance_tea+bundle.laboratory_level-bundle.item_level)/100:bundle.laboratory_level/100))).toFixed(2)),reset_results()}function add_tea(){switch(selected=$("#tea_sel").val(),"enhancing_tea"!=selected&&"super_enhancing_tea"!=selected||selected_teas.includes(selected)||($("#enhancing_tea_tea").remove(),$("#super_enhancing_tea_tea").remove(),selected_teas.splice(selected_teas.indexOf("enhancing_tea"==selected?"super_enhancing_tea":"enhancing_tea"),1),bundle.enhance_tea=0),selected_teas.includes(selected)||($("#selected_teas").append('<div id="'+selected+'_tea" class="selected_tea"><div id="'+selected+'/remove" class="selected_tea_x btn"><p>X</p></div><svg><use xlink:href="#'+selected+'"></use></svg></div>'),selected_teas.push(selected)),selected){case"enhancing_tea":bundle.enhance_tea=3;break;case"super_enhancing_tea":bundle.enhance_tea=6;break;case"blessed_tea":bundle.use_blessing=!0;break;case"wisdom_tea":bundle.wisdom=1.12}}function remove_tea(e){switch($("#"+e+"_tea").remove(),selected_teas.splice(selected_teas.indexOf(e),1),e){case"enhancing_tea":case"super_enhancing_tea":bundle.enhance_tea=0;break;case"blessed_tea":bundle.use_blessing=!1;break;case"wisdom_tea":bundle.wisdom=1}}function validate_field(e,t,a,s,n){if(""===a)return $("#"+e).val(""),bundle[t]=0,void update_values();temp=a.replace(/[^\d.]/g,"").replace(/^(\d*\.\d*)\..*/,"$1").replace(/^(0)(\d)/,"$2"),Number(temp)<s?$("#"+e).val(s.toLocaleString()):Number(temp)>n?$("#"+e).val(n.toLocaleString()):(temp.includes(".")?(temp=temp.split("."),temp=Number(temp[0]).toLocaleString()+"."+temp[1]):temp=Number(temp).toLocaleString(),$("#"+e).val(temp),bundle[t]=Number(temp.replace(/,/g,"")),update_values())}function reset(){for($("#use_proto").prop("checked",!1),$("#proto_price_cell").css("display","none"),$("#proto_at_cell").css("display","none"),$("#i_proto_price").val("0"),$("#i_proto_at").val("2"),$("#item_stats").css("display","none"),$(".item_slot_icon > svg > use").attr("xlink:href","#"),$("#item_slot_text").css("display","block"),$("#i_item_level").val("0"),i=1;i<=5;i++)$("#mat_"+i+"_cell").css("display","none"),$("#i_mat_"+i).val("0"),$("#prc_"+i).val("0");$("#iterations").text("0"),$("#i_coins").val("0"),materials=[],close_sel_menus(),update_values()}function close_sel_menus(){$("#item_filter").val(""),sel_item_is_open=!1,$("#sel_item_container").css("display","none"),$("#ehnace_level").val("0"),enhancer_item_is_open=!1,$("#enhancer_item_container").css("display","none")}function reset_results(){for(key in all_result)all_result[key]=0;for(key in avg_result)avg_result[key]=0;for($("#used_proto_cell").css("display","none"),i=1;i<=5;i++)$("#r_mat_"+i+"_cell").css("display","none");$("#result_title").text("Total"),$("#time").text("0"),$("#tries").text("0"),$("#exp").text("0"),$("#coins").text("0"),$("#cost").text("0"),$("#l_cost").text("0"),$("#h_cost").text("0"),$("#start_1 > p").text("Start 1 time"),$("#start_10 > p").text("Start 10 times"),$("#start_100 > p").text("Start 100 times")}function update_result(){for(key in avg_result)"time"==key?$("#"+key).text(formatTime(avg_result[key])):$("#"+key).text(avg_result[key].toLocaleString());for($("#iterations").text(all_result.em),$("#used_proto_cell").css("display","none"),i=1;i<=5;i++)$("#r_mat_"+i+"_cell").css("display","none");for(bundle.use_proto&&$("#used_proto_cell").css("display","flex"),i=0;i<materials.length;i++)$("#r_mat_"+(i+1)+"_cell").css("display","flex"),$("#r_mat_"+(i+1)+"_cell_icon > svg > use").attr("xlink:href","#"+materials[i]);$("#enhance_area").scrollTop($("#enhance_area").outerHeight(!0))}function get_values(){for(key in bundle)"total_bonus"!==key&&"em"!==key&&("use_proto"==key?bundle[key]=$("#"+key).prop("checked"):"proto_at"==key?(Number($("#i_"+key).val().replace(/,/g,"")<=1)&&$("#i_"+key).val("2"),bundle[key]=Number($("#i_"+key).val().replace(/,/g,""))):"stop_at"==key?(Number($("#i_"+key).val().replace(/,/g,"")<=1)&&$("#i_"+key).val("1"),bundle[key]=Number($("#i_"+key).val().replace(/,/g,""))):"wisdom"!=key&&"use_blessing"!=key&&"enhance_tea"!=key&&(bundle[key]=Number($("#i_"+key).val().replace(/,/g,""))))}function change_item(e){for(reset(),$(".item_slot_icon > svg > use").attr("xlink:href","#"+e),sel_item_is_open=!1,$("#sel_item_container").css("display","none"),$("#item_slot_text").css("display","none"),$("#proto_price_cell").css("display","none"),$("#proto_at_cell").css("display","none"),$("#i_proto_price").val("0"),$("#i_proto_at").val("2"),$("#item_stats").css("display","flex"),materials=[],i=0;i<items_data[e].enhancementCosts.length;i++)elm=items_data[e].enhancementCosts[i],"coin"==elm[0]?($("#i_coins").val(elm[1]),bundle.coins=elm[1]):(materials.push(elm[0]),$("#mat_"+(i+1)+"_cell").css("display","flex"),$("#mat_"+(i+1)+"_icon > svg > use").attr("xlink:href","#"+elm[0]),$("#i_mat_"+(i+1)).val(elm[1]),bundle["mat_"+(i+1)]=elm[1]);for(key in $("#i_item_level").val(items_data[e].itemLevel),bundle.item_level=items_data[e].itemLevel,items_data)$("#"+key+"_list").css("display","flex");update_values()}function filter(){if(""!=(temp=$("#item_filter").val().toLowerCase()))for(key in items_data)key.includes(temp)?$("#"+key+"_list").css("display","flex"):$("#"+key+"_list").css("display","none");else for(key in items_data)$("#"+key+"_list").css("display","flex")}function change_enhancer(e){switch(temp=Number($("#ehnace_level").val())){case 0:temp=1*items_data[e].baseBonus;break;case 1:temp=1.02*items_data[e].baseBonus;break;case 2:temp=1.042*items_data[e].baseBonus;break;case 3:temp=1.066*items_data[e].baseBonus;break;case 4:temp=1.092*items_data[e].baseBonus;break;case 5:temp=1.12*items_data[e].baseBonus;break;case 6:temp=1.15*items_data[e].baseBonus;break;case 7:temp=1.182*items_data[e].baseBonus;break;case 8:temp=1.216*items_data[e].baseBonus;break;case 9:temp=1.252*items_data[e].baseBonus;break;case 10:temp=1.29*items_data[e].baseBonus;break;case 11:temp=1.33*items_data[e].baseBonus;break;case 12:temp=1.372*items_data[e].baseBonus;break;case 13:temp=1.416*items_data[e].baseBonus;break;case 14:temp=1.462*items_data[e].baseBonus;break;case 15:temp=1.51*items_data[e].baseBonus;break;case 16:temp=1.56*items_data[e].baseBonus;break;case 17:temp=1.612*items_data[e].baseBonus;break;case 18:temp=1.666*items_data[e].baseBonus;break;case 19:temp=1.722*items_data[e].baseBonus;break;case 20:temp=1.78*items_data[e].baseBonus}$("#i_enhancer_bonus").val(temp.toFixed(2)),bundle.enhancer_bonus=temp,close_sel_menus()}function on_click_btn(t){"reset"==t?reset():materials.length>0&&($(".button").off("click"),$(".button").css("opacity",.5),bundle.em="start_1"==t?1:"start_10"==t?10:100,$("#cal").text("Calculating 0%"),$("#t_tries").text("Tries 0"),$("#calculating").css("display","flex"),worker=new Worker("enhance_worker.js"),all_result.em+=bundle.em,close_sel_menus(),worker.postMessage({bundle:bundle,avg:avg_result,all:all_result}),worker.onmessage=function(e){0==e.data.type?1==bundle.em?$("#t_tries").text("Tries "+e.data.data.toLocaleString()):10==bundle.em?$("#t_tries").text("Tries "+(e.data.data/10).toLocaleString()):$("#t_tries").text("Tries "+(e.data.data/100).toLocaleString()):1==e.data.type?1==bundle.em?$("#cal").text("Calculating "+100*e.data.data+"%"):10==bundle.em?$("#cal").text("Calculating "+10*e.data.data+"%"):$("#cal").text("Calculating "+e.data.data+"%"):($("#calculating").css("display","none"),1==bundle.em?$("#result_title").text("Total"):$("#result_title").text("AVG Total"),$("#start_1 > p").text("Add 1 time"),$("#start_10 > p").text("Add 10 times"),$("#start_100 > p").text("Add 100 times"),all_result=e.data.all,avg_result=e.data.avg,update_result(),$(".button").on("click",(e=>{on_click_btn(e.currentTarget.id)})),$(".button").css("opacity",1),worker.terminate())},worker.onerror=function(t){$(".button").on("click",(()=>{on_click_btn(e.currentTarget.id)})),$(".button").css("opacity",1),worker.terminate()})}$(document).ready((function(){for(key in reset(),get_values(),update_values(),items_data)$("#sel_item").append('<div id="'+key+'_list" value="'+key+'"><svg><use xlink:href="#'+key+'"></svg></use></div>');for(temp=Object.keys(items_data),i=296;i<temp.length;i++)$("#enhancer_item").append('<div id="'+temp[i]+'_enhance" value="'+temp[i]+'"><svg><use xlink:href="#'+temp[i]+'"></svg></use></div>');$("#menu_bg").on("click",(function(){$("#menu_bg").css("display","none"),$("#info_menu").css("display","none"),$("#success_rate_menu").css("display","none")})),$("#success_rate_btn").on("click",(function(){$("#menu_bg").css("display","flex"),$("#success_rate_menu").css("display","flex")})),$("#item_slot").on("click",".item_slot_icon",(function(){sel_item_is_open?(sel_item_is_open=!1,$("#sel_item_container").css("display","none")):(sel_item_is_open=!0,$("#sel_item_container").css("display","flex"))})),$("#info_btn").on("click",(function(){$("#menu_bg").css("display","flex"),$("#info_menu").css("display","flex")})),$("#item_filter").on("input",(function(){filter()})),$("#sel_item").on("click","div",(function(){change_item($(this).attr("value")),update_values()})),$("#i_item_level").on("input",(()=>{validate_field($(this)[0].id,"item_level",$(this).val(),0,200)})),$("#i_start_at").on("input",(function(){validate_field($(this)[0].id,"start_at",$(this).val(),0,19)})),$("#i_stop_at").on("input",(function(){validate_field($(this)[0].id,"stop_at",$(this).val(),0,20)})),$("#use_proto").on("input",(function(){bundle.use_proto=$("#use_proto").prop("checked"),bundle.use_proto?($("#proto_price_cell").css("display","flex"),$("#proto_at_cell").css("display","flex")):($("#proto_price_cell").css("display","none"),$("#proto_at_cell").css("display","none")),reset_results()})),$("#i_proto_at").on("input",(function(){validate_field($(this)[0].id,"proto_at",$(this).val(),0,19)})),$(".mat_sel").on("input",(function(){validate_field($(this)[0].id,$(this)[0].id.replace("i_",""),$(this).val(),0,1e3)})),$(".pric_sel").on("input",(function(){validate_field($(this)[0].id,$(this)[0].id.replace("i_",""),$(this).val(),0,1e7)})),$("#i_enhance_skill").on("input",(function(){validate_field($(this)[0].id,"enhance_skill",$(this).val(),0,200)})),$("#i_enhancer_bonus").on("input",(function(){validate_field($(this)[0].id,"enhancer_bonus",$(this).val(),0,100)})),$("#i_enhancer_bonus").on("click",(function(){enhancer_item_is_open?(enhancer_item_is_open=!1,$("#enhancer_item_container").css("display","none")):(enhancer_item_is_open=!0,$("#enhancer_item_container").css("display","flex"))})),$("#enhancer_item").on("click","div",(function(){change_enhancer($(this).attr("value")),update_values()})),$("#i_laboratory_level").on("input",(function(){validate_field($(this)[0].id,"laboratory_level",$(this).val(),0,8)})),$("#tea_sel").change((function(){add_tea(),update_values()})),$(".selected_teas").on("click",".selected_tea_x",(function(){id=$(this)[0].id.split("/")[0],remove_tea(id),update_values()})),$(".button").on("click",(function(){on_click_btn($(this)[0].id)}))}));