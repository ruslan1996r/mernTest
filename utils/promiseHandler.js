//Возвращает два значения: данные и ошибку, в зависимости от наявности данных
//Если есть какие-то данные, верни их, а в качестве ошибки верни undefined
//Если же данных нет, верни undefined вместо данных и информацию об ошибке вторым параметром

const handle = promise => {
  return promise
    .then(data => [data, undefined])
    .catch(error => Promise.resolve([undefined, error]));
};

module.exports = handle;
