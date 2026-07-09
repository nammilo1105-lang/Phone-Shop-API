const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const UPLOADS = path.join(__dirname, "../uploads");

let total = 0;

async function convert(folder){

    const files = fs.readdirSync(folder);

    for(const file of files){

        const full = path.join(folder,file);

        const stat = fs.statSync(full);

        if(stat.isDirectory()){
            await convert(full);
            continue;
        }

        const ext = path.extname(file).toLowerCase();

        if(![".jpg",".jpeg",".png"].includes(ext))
            continue;

        const output = full.replace(ext,".webp");

        await sharp(full)
            .webp({
                quality:80
            })
            .toFile(output);

        total++;

        console.log("✔",output);

        // nếu muốn xóa ảnh gốc thì bỏ comment
        // fs.unlinkSync(full);
    }
}

(async()=>{

    console.log("Converting...");

    await convert(UPLOADS);

    console.log("----------------------");

    console.log("Converted:",total);

})();