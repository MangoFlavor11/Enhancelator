let success_rate = [
  50, //+1
  45, //+2
  45, //+3
  40, //+4
  40, //+5
  40, //+6
  35, //+7
  35, //+8
  35, //+9
  35, //+10
  30, //+11
  30, //+12
  30, //+13
  30, //+14
  30, //+15
  30, //+16
  30, //+17
  30, //+18
  30, //+19
  30 //+20
  ],
temp_cost = 0;

function cal_exp(il, el) {
  return 14 + 1.4*il*(1+el)
}

self.onmessage = function(e) {
  total_tries = 0
  curr_tries = 0
  total_used_proto = 0
  curr_used_proto = 0
  curr_em = 0
  curr_cost = 0
  l_cost = 1e300
  h_cost = 0
  r = 0

  //this is just for the sake off tries to be updated faster or slower depedning of stop_at
  if(e.data.stop_at >= 18)
    s_tries = 1276777
  else if(e.data.stop_at >= 15)
    s_tries = 976777
  else if(e.data.stop_at >= 13)
    s_tries = 16397
  else
    s_tries = 1639

  //used for result
  result = {
    tries: 0,
    used_proto: 0,
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
    proto_prc: 0,
    cost: 0,
    time: 0,
    exp: 0,
  }
  //start 1 or 10 or 100
  while(curr_em < e.data.em) {
    curr_em++
    enhance_level = e.data.start_at
    curr_tries = 0
    curr_used_proto = 0
    //loop till reaching desired item level
    while(enhance_level < e.data.stop_at) {
      total_tries++
      curr_tries++
      r = Math.random() * (100 - 0) + 0
      if(r <= success_rate[enhance_level]*e.data.total_bonus) {
        if(e.data.use_blessing) {
          r = Math.random() * (100 - 0) + 0
          if(r <= 1) {
            result.exp += cal_exp(e.data.item_level, enhance_level)*e.data.wisdom+cal_exp(e.data.item_level, enhance_level+1)*e.data.wisdom
            enhance_level += 2
          }
          else {
            result.exp += cal_exp(e.data.item_level, enhance_level)*e.data.wisdom
            enhance_level++
          }
        }
        else {
          result.exp += cal_exp(e.data.item_level, enhance_level)*e.data.wisdom
          enhance_level++
        }
      }
      else if(e.data.use_proto && enhance_level >= e.data.proto_at) {
        total_used_proto++
        curr_used_proto++
        result.exp += cal_exp(e.data.item_level, enhance_level)*e.data.wisdom*0.1
        enhance_level--
      }
      else {
        result.exp += cal_exp(e.data.item_level, enhance_level)*e.data.wisdom*0.1
        enhance_level = 0
      }

      if(total_tries % s_tries == 0)
        self.postMessage({"type": 0, "data": total_tries.toString()})
    }

    result.tries += curr_tries
    result.used_proto += curr_used_proto
    result.mat_1 += curr_tries * e.data.mat_1
    result.mat_2 += curr_tries * e.data.mat_2
    result.mat_3 += curr_tries * e.data.mat_3
    result.mat_4 += curr_tries * e.data.mat_4
    result.mat_5 += curr_tries * e.data.mat_5
    result.prc_1 += curr_tries * e.data.mat_1 * e.data.prc_1
    result.prc_2 += curr_tries * e.data.mat_2 * e.data.prc_2
    result.prc_3 += curr_tries * e.data.mat_3 * e.data.prc_3
    result.prc_4 += curr_tries * e.data.mat_4 * e.data.prc_4
    result.prc_5 += curr_tries * e.data.mat_5 * e.data.prc_5
    result.coins += curr_tries * e.data.coins
    result.time += curr_tries * e.data.time
    result.proto_prc += curr_used_proto * e.data.proto_price
    result.cost = result.prc_1 + result.prc_2 + result.prc_3 + result.prc_4 + result.prc_5 + result.coins + result.proto_prc

    curr_cost = (curr_tries * e.data.mat_1 * e.data.prc_1) + (curr_tries * e.data.mat_2 * e.data.prc_2) +
      (curr_tries * e.data.mat_3 * e.data.prc_3) + (curr_tries * e.data.mat_4 * e.data.prc_4) + 
      (curr_tries * e.data.mat_5 * e.data.prc_5) + (curr_tries * e.data.coins) + (curr_used_proto * e.data.proto_price)

    if(curr_cost < l_cost)
      l_cost = curr_cost

    if(curr_cost > h_cost)
      h_cost = curr_cost

    self.postMessage({"type": 1, "data": curr_em})
  }

  if(e.data.em == 10)
    for(key in result) {
      result[key] /=10
    }
  else if(e.data.em == 100)
    for(key in result) {
      result[key] /=100
    }

  //add after dividing
  result.l_cost = l_cost
  result.h_cost = h_cost

  self.postMessage({"type": 2, "data": result})
}