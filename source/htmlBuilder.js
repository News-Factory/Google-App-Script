function testWrapper(){
    var title='Intro Headline';
    var req=true;
    var itemId='1354073606';
    var itemType='text';
    Logger.log(entry(title, req, itemId, {type:itemType,id:"tags",autocomplete:"off"}));
}

function buildEntireHTMLform(){
  
}

//Core html contructors
function wrap(content,wrapType,attrs){
    //main wrapping function, generates a <tag class="something">
    //attrs = {class:..., id:...}
    var res="<"+wrapType;
    var attrTxt="";
    if (attrs!=null){
        for (var n in attrs){attrTxt+=" "+n+"='"+attrs[n]+"'";}
    }
    res+=attrTxt+">\n";
    res+=indent(content,1)+"\n";
    res+="</"+wrapType+"> "+comment(attrTxt);
    return res;
}

function indent(segment,times){
    //adds indentaion for formatting purposes
    var gap="";
    for (var i=0; i<times; i++){
        gap+="    ";
    }
    if (segment.indexOf('\n')>-1){
        var splitted=segment.split('\n');
        var res=gap+splitted[0];
        for (var i=1; i<splitted.length; i++){
            res+='\n'+gap+splitted[i];
        }
        return res;
    } else {
        return gap+segment;
    }
}

function comment(content){
    return "<!--"+content+"-->";
}

function entry(title, req, itemId, attrs){
    //main htmlForm building technique
    //every formItem becomes a <div> containing a <label> and an <input>
    var content=req ? title+required() : title;
    content=wrap(content,'label',null);
    var input="<input";
    if (attrs!=null){
        for (var n in attrs){input+=" "+n+"='"+attrs[n]+"'";}
    }
    if (req){input+=' required';}
    input+=' name="entry.'+itemId+'" />';
    content+='\n'+input;
    return wrap(content,'div',{class:'field-wrap'});
}

function required(){
    return '<span class="req">*</span>';
}