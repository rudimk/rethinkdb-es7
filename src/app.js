require("babel-core/register");
require("babel-polyfill");

import RethinkPlus from 'rethink-plus'
let got = require("got")

let db = new RethinkPlus({
  host: 'localhost',
  port: 28015
})

async function getAgent(){
	let response = await got('http://pplapi.com/random.json')
	let agent = JSON.parse(response.body)
	return agent
}

async function saveAgent(agent){
	let table = db.db('experiments').table('agents')
	let newAgent = await table.insert(agent)
	console.log(`Saved agent ${agent['id_str']} in RethinkDB.`)
	return true
}

async function singleAgent(){
	let agent = await getAgent()
	let status = await saveAgent(agent)
}

async function getAgents(num){
	let response = await got(`http://pplapi.com/batch/${num}/sample.json`)
	let agents = JSON.parse(response.body)
	return agents
}

async function saveAgents(agents){
	let table = db.db('experiments').table('agents')
	for(let agent of agents){
		let newAgent = await table.insert(agent)
		console.log(`Saved agent ${agent['id_str']} in RethinkDB.`)
	}
	return true
}

async function multipleAgents(n){
	let agents = await getAgents(n)
	let status = await saveAgents(agents)
}

//singleAgent()
multipleAgents(10)