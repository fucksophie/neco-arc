import { readFileSync, existsSync } from "fs"

let config = {}

if(existsSync("./config.json")) {
	config = JSON.parse(readFileSync("./config.json").toString())
} else {
	config = JSON.parse(process.env["JSON_CONFIG"])
}

export default config