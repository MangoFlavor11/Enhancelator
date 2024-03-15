/*
This is a fan made Emulator for "Milky way Idle" games Enhancing mechanic by (MangoFlavor).
Obviously i do not own the game nor any art assets in the this projects
*/

var worker = "",
bundle = {
	item_level: 0,
	start_at: 0,
	stop_at: 0,
	use_proto: false,
	proto_at: 0,
	proto_price: 0,
	enhance_skill: 0,
	enhancer_bonus: 0,
	laboratory_level: 0,
	enhance_tea: 0,
	total_bonus: 0,
	wisdom: 1,
	use_blessing: false,
	time: 0,
	mat_1: 0,
	mat_2: 0,
	mat_3: 0,
	mat_4: 0,
	mat_5: 0,
	prc_1: 0,
	prc_2: 0,
	prc_3: 0,
	prc_4: 0,
	prc_5: 0,
	coins: 0,
	em: 1,
},
sel_item_is_open = false,
materials = [],
selected_teas = [],
temp = 0;

function addLeadingZeros(num, length) {
  var str = num.toString()
  while (str.length < length) {
    str = '0' + str
  }
  return str
}

//tims as seconds, return string "00h:00m:00s"
function formatTime(seconds) {
  // Calculate the number of years, days, hours, minutes, and seconds
  var years = Math.floor(seconds / (365 * 24 * 3600))
  var days = Math.floor((seconds % (365 * 24 * 3600)) / (24 * 3600))
  var hours = Math.floor((seconds % (24 * 3600)) / 3600)
  var minutes = Math.floor((seconds % 3600) / 60)
  var remainingSeconds = Math.floor(seconds % 60)

  // Check if the time is greater than 365 days
  if (years > 0) {
    // Check if the number of years is less than 99
    if (years < 99) {
      return (
        addLeadingZeros(years, 2) + 'y:' +
        addLeadingZeros(days, 2) + 'd:' +
        addLeadingZeros(hours, 2) + 'h'
      );
    } else {
      return (
        '000y:' +
        addLeadingZeros(days, 2) + 'd:' +
        addLeadingZeros(hours, 2) + 'h'
      )
    }
  }

  // Check if the time is greater than 24 hours
  if (days > 0) {
    return (
      addLeadingZeros(days, 2) + 'd:' +
      addLeadingZeros(hours, 2) + 'h:' +
      addLeadingZeros(minutes, 2) + 'm'
    )
  }

  // Format the time as a string '00h:00m:00s'
  return (
    addLeadingZeros(hours, 2) + 'h:' +
    addLeadingZeros(minutes, 2) + 'm:' +
    addLeadingZeros(remainingSeconds, 2) + 's'
  )
}

function update_esList() {
	bundle.total_bonus = 1+(((bundle.enhance_skill-bundle.item_level)+bundle.enhance_tea+bundle.laboratory_level)*0.05+bundle.enhancer_bonus)/100
	for(i = 0; i < success_rate.length; i++) {
		es = Number(success_rate[i]*bundle.total_bonus).toFixed(3)
		$("ul").find("li:eq("+i+")").text("+"+(i+1)+": +"+es+"%")
	}
}

function add_tea() {
	selected = $("#tea_sel").val()

	//=====Make sure only one enhance tea present=====
	if(selected == "enhancing_tea" || selected == "super_enhancing_tea") {
		$("#enhancing_tea_tea").remove()
		$("#super_enhancing_tea_tea").remove()
		selected_teas.splice(selected_teas.indexOf(selected == "enhancing_tea" ? "super_enhancing_tea":"enhancing_tea"), 1)
		bundle.enhance_tea = 0
	}
	//================================================

	if(!selected_teas.includes(selected)) {
		$("#selected_teas").append('<div id="'+selected+'_tea" class="selected_tea"><div id="'+selected+'/remove" class="selected_tea_x btn"><p>X</p></div><svg><use xlink:href="#'+selected+'"></use></svg></div>')
		selected_teas.push(selected)
	}
	switch(selected) {
	case "enhancing_tea":
		bundle.enhance_tea = 3
		break
	case "super_enhancing_tea":
		bundle.enhance_tea = 6
		break
	case "blessed_tea":
		bundle.use_blessing = true
		break
	case "wisdom_tea":
		bundle.wisdom = 1.12
		break
	}
}

function remove_tea(id) {
	$("#"+id+"_tea").remove()
	selected_teas.splice(selected_teas.indexOf(id), 1)
	switch(id) {
	case "enhancing_tea":
		bundle.enhance_tea = 0
		break
	case "super_enhancing_tea":
		bundle.enhance_tea = 0
		break
	case "blessed_tea":
		bundle.use_blessing = false
		break
	case "wisdom_tea":
		bundle.wisdom = 1
		break
	}
}

function validate_number(n, min, max) {
	if (n === "") return ""
    let temp = n.replace(/[^\d.]/g, '').replace(/^(\d*\.\d*)\..*/, '$1').replace(/^(0)(\d)/, '$2')

    if(Number(temp) < min) return min.toLocaleString()
    else if(Number(temp) > max) return max.toLocaleString()
    	
	if(temp.includes(".")) {
		temp = temp.split('.')
		temp = Number(temp[0]).toLocaleString()+"."+temp[1]
	}
	else
		temp = Number(temp).toLocaleString()

    return temp
}

function reset() {
	$("#use_proto").prop("checked", false)
	$("#item_stats").css("display", "none")
	$(".item_slot_icon").empty()

	$("#used_proto_cell").css("display", "none")
	for(i = 1; i <=5; i++) {
		$("#r_mat_"+i+"_cell").css("display", "none")
	}

	$("#coins").text("0")
	$("#tries").text("0")
	$("#time").text("0")
	$("#exp").text("0")
	$("#cost").text("0")
	$("#l_cost").text("0")
	$("#h_cost").text("0")
	$("#result_title").text("Total")
	$("#item_filter").val("")
	sel_item_is_open = false
	$("#sel_item_container").css("display", "none")
	materials = []
	update_esList()
}

function reset_item_stats() {
	for(i = 1; i <=5; i++) {
		$("#mat_"+i+"_cell").css("display", "none")
		$("#i_mat_"+i).val("0")
		$("#prc_"+i).val("0")
	}
	$("#i_coins").val("0")
	$("#i_item_level").val("0")
}

function update_result(data) {
	for(key in data) {
		if(key == "time")
			$("#"+key).text(formatTime(data[key]))
		else
			$("#"+key).text(data[key].toLocaleString())
	}

	$("#used_proto_cell").css("display", "none")
	for(i = 1; i <=5; i++) {
		$("#r_mat_"+i+"_cell").css("display", "none")
	}

	if(bundle.use_proto)
		$("#used_proto_cell").css("display", "flex")
	for(i = 0; i < materials.length; i++) {
		$("#r_mat_"+(i+1)+"_cell").css("display", "flex")
		$("#r_mat_"+(i+1)+"_cell_icon").empty()
		$("#r_mat_"+(i+1)+"_cell_icon").append('<svg><use xlink:href="#'+materials[i]+'"></use></svg>')
	}
}

function get_values() {
	for(key in bundle) {
		if(key !== "total_bonus" && key !== "em")
			if(key == "use_proto")
				bundle[key] = $("#"+key).prop('checked')
			else if(key == "proto_at") {
				if(Number($("#i_"+key).val().replace(/,/g, '') <= 1))
					$("#i_"+key).val("2")
				bundle[key] = Number($("#i_"+key).val().replace(/,/g, ''))
			}
			else if(key == "stop_at") {
				if(Number($("#i_"+key).val().replace(/,/g, '') <= 1))
					$("#i_"+key).val("1")
				bundle[key] = Number($("#i_"+key).val().replace(/,/g, ''))
			}
			else if(key != "wisdom" && key != "use_blessing" && key != "enhance_tea")
				bundle[key] = Number($("#i_"+key).val().replace(/,/g, ''))
	}
}

function change_item(id) {
	$(".item_slot_icon").empty()
	$(".item_slot_icon").append('<svg><use xlink:href="#'+id+'"></use></svg>')
	sel_item_is_open = false
	$("#sel_item_container").css("display", "none")

	$("#item_stats").css("display", "flex")
	materials = []
	for(i = 0; i < items_data[id].enhancementCosts.length; i++) {
		elm = items_data[id].enhancementCosts[i]
		if(elm[0] == "coin")
			$("#i_coins").val(elm[1])
		else {
			materials.push(elm[0])
			$("#mat_"+(i+1)+"_cell").css("display", "flex")
			$("#mat_"+(i+1)+"_icon").empty()
			$("#mat_"+(i+1)+"_icon").append('<svg><use xlink:href="#'+elm[0]+'"></use></svg>')
			$("#i_mat_"+(i+1)).val(elm[1])
		}
	}
	$("#i_item_level").val(items_data[id].itemLevel)
}

function filter() {
	temp = $("#item_filter").val().toLowerCase()
	$("#sel_item").empty()
	if(temp != "")
		for(key in items_data) {
			if(key.includes(temp))
	    	$("#sel_item").append('<div value="'+key+'"><svg><use xlink:href="#'+key+'"></svg></use></div>')
		}
	else
		for(key in items_data) {
	    $("#sel_item").append('<div value="'+key+'"><svg><use xlink:href="#'+key+'"></svg></use></div>')
		}
}

$(document).ready(function() {
	reset()
	filter()
	get_values()
	update_esList()

	$("#menu_bg").on("click", function() {
    $("#menu_bg").css("display", "none")
		$("#info_menu").css("display", "none")
		$("#success_rate_menu").css("display", "none")
  })

	$("#success_rate_btn").on("click", function() {
		$("#menu_bg").css("display", "flex")
		$("#success_rate_menu").css("display", "flex")
  })

	$("#item_slot").on("click", ".item_slot_icon", function() {
		if(!sel_item_is_open) {
			sel_item_is_open = true
			$("#sel_item_container").css("display", "flex")
		}
		else {
			sel_item_is_open = false
			$("#sel_item_container").css("display", "none")
		}
	})

  $("#info_btn").on("click", function() {
    $("#menu_bg").css("display", "flex")
		$("#info_menu").css("display", "flex")
  })

  $("#item_filter").on("input", function() {
  	filter()
  })

  $("#sel_item").on("click", "div", function() {
  	reset_item_stats()
  	change_item($(this).attr("value"))
  	get_values()
  	update_esList()
  })

	$("#i_item_level").on("input", function() {
		temp = validate_number($(this).val(), 0, 200)
		$(this).val(temp)
		bundle.item_level = Number(temp)
		update_esList()
   })

	$("#i_start_at").on("input", function() {
		temp = validate_number($(this).val(), 0, 19)
		$(this).val(temp)
   })

  $("#i_stop_at").on("input", function() {
		temp = validate_number($(this).val(), 0, 20)
		$(this).val(temp)
  })

  $("#use_proto").on("input", function() {
		bundle.use_proto = $("#use_proto").prop('checked')
		if(bundle.use_proto) {
			$("#proto_price_cell").css("display", "flex")
			$("#proto_at_cell").css("display", "flex")
		}
		else {
			$("#proto_price_cell").css("display", "none")
			$("#proto_at_cell").css("display", "none")
		}
  })

  $("#i_proto_at").on("input", function() {
		temp = validate_number($(this).val(), 0, 19)
		$(this).val(temp)
  })

  $(".mat_sel").on("input", function() {
		temp = validate_number($(this).val(), 0, 1000)
		$(this).val(temp)
  })

  $(".pric_sel").on("input", function() {
		temp = validate_number($(this).val(), 0, 10000000)
		$(this).val(temp)
  })

  $("#i_enhance_skill").on("input", function() {
		temp = validate_number($(this).val(), 0, 200)
		$(this).val(temp)
		bundle[$(this)[0].id.replace("i_", "")] = Number(temp)
		update_esList()
	})

	$("#i_enhancer_bonus").on("input", function() {
		temp = validate_number($(this).val(), 0, 100)
		$(this).val(temp)
		bundle[$(this)[0].id.replace("i_", "")]  = Number(temp)
		update_esList()
  })

	$("#i_laboratory_level").on("input", function() {
		temp = validate_number($(this).val(), 0, 8)
		$(this).val(temp)
		bundle[$(this)[0].id.replace("i_", "")]  = Number(temp)
		update_esList()
  })

	$("#tea_sel").change(function() {
		add_tea()
		update_esList()
  })

  $(".selected_teas").on("click", ".selected_tea_x", function() {
		id = $(this)[0].id.split("/")[0]
		remove_tea(id)
		update_esList()
  })

	$(".button").on("click", function() {
		on_click_btn($(this)[0].id)
	})
})

function on_click_btn(id) {
	if(id == "reset")
		reset()
	else if(materials.length > 0) {
		$(".button").off("click")
		$(".button").css("opacity", 0.5)

		if(id == "start_1")
			bundle.em = 1
		else if(id == "start_10")
			bundle.em = 10
		else
			bundle.em = 100

		get_values()
		update_esList()
		$("#cal").text("Calculating 0%")
		$("#t_tries").text("Tries 0")
		$("#calculating").css("display", "flex")

		worker = new Worker('enhance_worker.js')
		worker.postMessage(bundle)

		worker.onmessage = function(e) {
			if(e.data.type == 0) {
				if(bundle.em == 1)
					$("#t_tries").text("Tries "+(e.data.data).toLocaleString())
				else if(bundle.em == 10)
					$("#t_tries").text("Tries "+(e.data.data/10).toLocaleString())
				else
					$("#t_tries").text("Tries "+(e.data.data/100).toLocaleString())				
			}
			else if(e.data.type == 1) {
				if(bundle.em == 1)
					$("#cal").text("Calculating "+e.data.data*100+"%")
				else if(bundle.em == 10)
					$("#cal").text("Calculating "+e.data.data*10+"%")
				else
					$("#cal").text("Calculating "+e.data.data+"%")
			}
			else {
				$("#calculating").css("display", "none")
				if(bundle.em == 1) {
					$("#result_title").text("Total")
				}
				else {
					$("#result_title").text("AVG Total")
				}
		    	update_result(e.data.data)
		    	$(".button").on("click", (e)=> {on_click_btn(e.currentTarget.id)})
		    	$(".button").css("opacity", 1)
		  		worker.terminate()	
			}
		}

		worker.onerror = function(error) {
			$(".button").on("click", ()=> {on_click_btn(e.currentTarget.id)})
			$(".button").css("opacity", 1)
			worker.terminate()
		}
	}
}