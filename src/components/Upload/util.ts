import SparkMd5 from 'spark-md5'

const objectIdReg = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

export const encryptionFile = (file: File, chunkSize: number=1024 * 1024 * 5) => {
  const { size } = file

  let currentChunk:number = 0,
      fileReader:FileReader = new FileReader(),
      totalChunks: number = Math.ceil(size / chunkSize),
      spark = new SparkMd5.ArrayBuffer(),
      fileSlice: (start: number, end: number) => Blob = File.prototype.slice

  return new Promise((resolve, reject) => {

    fileReader.onload = async (e: any) => {
      if(!e.target) return reject('读取错误')
      //添加读取的内容
      spark.append(e.target.result)
      currentChunk ++
      //继续读取
      if(currentChunk < totalChunks) {
        loadNext()
      }
      //读取完毕
      else {
        resolve(spark.end())
      }
    }

    //错误处理
    fileReader.onerror = reject

    //文件内容读取
    function loadNext() {
      let start: number = currentChunk * chunkSize,
          end: number = currentChunk + 1 === totalChunks ? size : (currentChunk + 1) * chunkSize
      const chunks: Blob = fileSlice.call(file, start, end)
      fileReader.readAsArrayBuffer(chunks)
    }

    loadNext()

  })
}

export const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

export const toBase64 = (str: string): string => {
  return btoa(str)
}

export const isObjectId = (str: string) => objectIdReg.test(str)

export const propsValueValid = (value: string[], length: number) => {
  return Array.isArray(value) && value.length >= length && value.every(isObjectId)
}