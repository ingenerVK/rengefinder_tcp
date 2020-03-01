// Import net module.
var net = require('net');

var db = require('knex')({
        client: 'sqlite3',
        connection: {
        filename: './dim_db.db',
          },
          useNullAsDefault: true
        });

console.log('Start core_data_exchange!');
function timestamp_to_datetime (timestamp) {
    let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let m = 0;
  for (let [i, v] of month.entries())
  {
    //console.log(month[i], Date(timestamp).split(' ')[1]);
    if (month[i] ==  Date(timestamp).split(' ')[1])
        {
            //console.log(i+1, v);
            m = i+1;
        }
  }
  if (m<10)
    m = '0' + m;
  let date_time = Date(timestamp).split(' ')[3] +'-'+ m +'-'+ Date(timestamp).split(' ')[2] +' '+Date(timestamp).split(' ')[4];
      
    return date_time;
};
var host =[
/*'192.168.15.214',
'192.168.15.215',
'192.168.15.145',
'192.168.15.216',
'192.168.15.217',
'192.168.15.218',
'192.168.15.219',
'192.168.15.221',
'192.168.15.222',
'192.168.15.223',
'192.168.15.224',
'192.168.15.225',
'192.168.15.226',
'192.168.15.227',
'192.168.15.228',
'192.168.15.229',
'192.168.15.231',
'192.168.15.233',
'192.168.15.205',
'192.168.15.188',
'192.168.15.199',
'192.168.15.195',
'192.168.15.209',
'192.168.15.180',
'192.168.15.213',
'192.168.15.206',
'192.168.15.212',
'192.168.15.190',
'192.168.15.181',
'192.168.15.208',
'192.168.15.204',
'192.168.15.207',
'192.168.15.159',
'192.168.15.240',
'192.168.15.243',
'192.168.15.184',
'192.168.15.198',
'192.168.15.192',
'192.168.15.170',
'192.168.15.197',
'192.168.15.175',
'192.168.15.177',
'192.168.15.182',
'192.168.15.179',
'192.168.15.172',
'192.168.15.168',
'192.168.15.186',
'192.168.15.191',
'192.168.15.194',
'192.168.15.185',
'192.168.15.174',
'192.168.15.153',
'192.168.15.150',
'192.168.15.162',*/
'192.168.25.140',
'192.168.25.141',
'192.168.25.143',
'192.168.25.144'
];
    var option = [];

 for(let i =0; i<host.length; i++)
 {
    //console.log("i:", i);
    option[i] = {host:host[i], port:2000};
 };
 console.log(option);
function IsJSON(str)
{
    try{
        JSON.parse(str);
        return JSON.parse(str);
    }
    catch(e){
        return '{}';
        //return e;
    }
}
function IsJSON_str(str)
{
    try{
        JSON.stringify(str);
        return JSON.stringifyr(str);
    }
    catch(e){
        return '{}';
    }
}

// This function create and return a net.Socket object to represent TCP client[i].
var it = 0;
function getConn(connName, option){

    var Value='';
    // Create TCP client[i].
    var client = [{}];
    console.log("legth: ",option.length);
    for (let i=0; i < option.length; i++)
    {
        //console.log(i, "option: ",option);
       client[i] = net.createConnection(option[i], function () {
        //var client = net.connect(option, function () {
            console.log('Connection name : ' + connName+option[i].host);
            console.log('Connection local address : ' + client[i].localAddress + ":" + client[i].localPort);
            console.log('Connection remote address : ' + client[i].remoteAddress + ":" + client[i].remotePort);
        });
    
    client[i].setTimeout(2000);
    client[i].setEncoding('utf8');
    }
    // When receive server send back data.
    for(let i =0; i<option.length; i++)
    {
    client[i].on('data', function (data) {
        //console.log(option[i].host +' Server return data : ' + data);
        var date_time = new Date();
        let tcp_data = data.split('<=>');
        //console.log("tcp_data split:", tcp_data);
        let dim;// = IsJSON(tcp_data);
        //let tcp_data = data;
        //let JSON_tcp_data = IsJSON(data.split('<=>'));
        //let JSON_tcp_data = JSON.parse(data.split('<=>'));
        //console.log(tcp_data.length, ' tcp_data: ',JSON_tcp_data);
        for(let i_tcp_data of tcp_data)
        {
        	dim = IsJSON(i_tcp_data);
            //JSON_tcp_data = IsJSON(i_tcp_data);
            if(dim !== "{}")    
            {
            console.log("HOST: ", option[i].host, "tcp_data:", dim);
            //for(let key in dim)
            //{
                //console.log("key: ",key);
               /* if (key=='dim'||key=='status'||key=='state')
                {
                    for(let key1 in dim[key])
                    {
                        //console.log("key1: ",key1, " : ",JSON_tcp_data[key][key1]);
                        if (it<30)
                        {
                            Value = Value + '("'+timestamp_to_datetime(date_time) +'", '+dim[key][+', "'+option[i].host+'", "'+key+'", "'+ key1 +'"),';
                        }
                        else
                        {
                            Value = Value+'("'+timestamp_to_datetime(date_time) +'", '+JSON_tcp_data[key][key1]+', "'+option[i].host+'", "'+key+'", "'+key1+'");';
                            //console.log("VAL: ",Value);
                            db.raw("insert into 'dim_hist' ('d_t', 'ip_adr' 'id_sensor', 'dim') values"+Value)
                                .then(function(resp){
                                    console.log("ansver->",resp)
                                })
                                .catch(error => {
                                    console.log('Error DB ', error);
                                })
                                it=0;
                                Value = '';
                        }
                        it++;
                    }*/
                //}
            }
        	//}
        }
    });

    // When connection disconnected.
    client[i].on('end',function () {
        console.log(option[i].host +' Client socket disconnect. ', client[i].connecting);
    client[i].end();
        client[i].destroy();
        setTimeout(function(){client[i].connect(option[i], function () {console.log("reconect", option[i].host);})}, 1000);
    });

    client[i].on('timeout', function () {
        console.log(option[i].host + ' Client connection timeout. ', client[i].connecting);
        client[i].end();
        client[i].destroy();
        client[i].unref();
        setTimeout(function(){client[i].connect(option[i], function () {console.log("reconect", option[i].host);})}, 1000);
    });

    client[i].on('error', function (err) {
        console.error(JSON.stringify(err), client[i].connecting, client[i].destroyed);
        client[i].end();
        client[i].destroy();
        setTimeout
        (function(){
            client[i].connect(option[i], 
                function () {console.log("reconect", option[i].host);})}, 1000);
    });

    //client[i].write(option[i].host + ' Node is connect ');
    //return client[i];
    client[i].write('start');
    //setTimeout(function(){client[i].write('stop')}, 10000);
}
}

// Create a java client[i] socket.
//var javaclient[i] = getConn('Java');

// Create node client[i] socket.
var nodeclient = setTimeout(function(){getConn('Node', option)}, 400);

//javaclient[i].write('Java is best programming language. ');

//nodeclient.write('Node is connect ');

function netWrite(data)
{
    //setTimeout(function(){nodeclient.write(IsJSON_str(data))}, 400);
    setTimeout(function(){nodeclient.write("start")}, 400);
}

module.exports = {
    netWrite: netWrite
};