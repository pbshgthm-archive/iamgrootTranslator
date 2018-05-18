var GrootLang={
	
	
	CharDict : ['\u200b','\u200c','\u200d','\u200e',
				'\u206a','\u206b','\u206c','\u206d','\u206e','\u206f'],	
	gapNum : 9,

	langBase: 'I am Groot',

	encode : function(str){
				var num,_tens,_ones,cs;
				var codes=[];
				var checksum=0;

				for(var i=0;i<str.length;i++){
					num=str[i].charCodeAt(0)-32;
					if(num<95){
						_tens=Math.floor(num/10);
						_ones=num%10;
						checksum+=(_ones+_tens);
						codes.push(this.CharDict[_tens]+
									this.CharDict[_ones]);
					}else return false;
				}

				cs=checksum%100;
				codes.push(this.CharDict[Math.floor(cs/10)]+
					this.CharDict[cs%10]);

				c=codes.join('');
				return codes;
			},

	decode : function(code){
				var str=[];
				var num,_tens,_ones,cs1,cs2;
				var checksum=0
				if(code.length%2!=0)return false;
				
				for(var i=0;i<code.length-2;i+=2){
					_tens=this.CharDict.indexOf(code[i]);
					_ones=this.CharDict.indexOf(code[i+1]);
					checksum+=(_tens+_ones);
					num=_tens*10+_ones;
					if(num<95){
						str.push(String.fromCharCode(num+32));
					}else return false;
				}

				var cs1=this.CharDict.indexOf(code[code.length-2]);
				var cs2=this.CharDict.indexOf(code[code.length-1]);

				if(checksum%100==(cs1*10)+cs2)
					return str.join('');
				else return false;
			},

	unicode : function (str) {
			
				var unicode=[];
				var chr;

				for(var i=0;i<str.length;i++){
					chr = str[i].charCodeAt(0).toString(16);
					if (chr.length > 2)
						unicode.push('\\u' + chr);
					else
						unicode.push('<'+str[i]+'>');

				}
				u=unicode.join('');
				return unicode.join('');
			},

	pack: function(code){
					var gap=['','','','','','','','',''];
					var min_dist=Math.floor(code.length/this.gapNum);
					var extra_gap=code.length%9;
					for(var i=0;i<this.gapNum;i++){
						if(i<extra_gap)
							gap[i]=code.splice(0,min_dist+1).join('');
						else
							gap[i]=code.splice(0,min_dist).join('');
					}
					return gap;
				},

	unpack: function(str){

				var code=[];
				var chr;

				for(var i=0;i<str.length;i++){
					chr = str[i].charCodeAt(0).toString(16);
					if (chr.length > 2)
						code.push(str[i]);
				}
				return code.join('');
	},

	toEnglish: function(str){
					var code=this.unpack(str);
					return this.decode(code);
			},

	toGroot: function(str){

				var code=this.encode(str);
				if(code==false)return false;
				
				var seg=this.pack(code);
				var groot=this.langBase.split('');
				for(var i=0;i<this.gapNum;i++)
					groot[i]+=seg[i];
				return groot.join('');

			}
}

$("#eng-inp").keypress(function(event) {
    if (event.which == 13) {
    	toGroot();
     }
});

$("#groot-inp").keypress(function(event) {
    if (event.which == 13) {
    	toEnglish();
     }
});

$('#copy-eng').bind('click',function(){
	var _txt=$("#eng-res").text();
	copyText(_txt);
});

$('#copy-groot').bind('click',function(){
	var _txt=$("#groot-res").text();
	copyText(_txt);
});


$('#groot-trans').bind('click',function(){
	toEnglish();
});

$('#eng-trans').bind('click',function(){
	toGroot();
});

function toGroot(){
	var eng_txt=$("#eng-inp").val();
	var groot=GrootLang.toGroot(eng_txt);
	console.log(groot);
	$("#groot-out").fadeIn();
	$("#groot-res").text(groot);
}

function toEnglish(){
	var groot_txt=$("#groot-inp").val();
	var eng=GrootLang.toEnglish(groot_txt);
	$("#eng-out").fadeIn();
	$("#eng-res").text(eng);
}

function copyText(txt) {
		var $temp = $("<input>");
  		$("body").append($temp);
  		$temp.val(txt).select();
  		document.execCommand("copy");
  		$temp.remove();
}