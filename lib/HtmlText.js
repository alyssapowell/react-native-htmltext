var parse5 = require('parse5');
var React = require('react');
var ReactNative = require('react-native');
var {
  Dimensions,
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = ReactNative;

var width = Dimensions.get('window').width;

var P_FONT_SIZE = 14

var index = 0;

var MAX_CHARS = Math.round(width / P_FONT_SIZE)

var FONT_FAMILY = {
  normal:'IowanOldStyle-Roman',
  heavy:'IowanOldStyle-Bold',
  italic:'IowanOldStyle-Italic',
}

var BLOCK_ELEMENTS = ["blockquote", "div", "hr", "ol", "pre", "ul", "li", "script", "p", "h1", "h2", "h3", "h4", "h5", "h6"]

var INLINE_ELEMENTS = ["b", "i", "em", "strong", "a", "br", "q", "span", "sub", "sup", "strong"]

var DEFAULT_STYLES = StyleSheet.create({
  a: {
    fontFamily: FONT_FAMILY.normal,
    color: '#329ce8',
  },
  b: {

  },
  text_b: {
    fontFamily: FONT_FAMILY.heavy,
  },
  strong: {
    
  },
  text_strong: {
    fontFamily: FONT_FAMILY.heavy,
  },
  blockquote: {
    paddingLeft: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#cccccc',
    marginBottom: 12
  },
  br: {

  },
  div: {

  },
  em: {
    
  },
  text_em: {
    
    fontStyle: 'italic',
    fontFamily: FONT_FAMILY.italic,
  },
  h1: {
    
    marginTop:24,
  },
  h2: {
    
    marginTop:30,
  },
  h3: {
    
    marginTop:18,
  },
  h4: {
    
    marginTop:16,
  },
  h5: {
    
    marginTop:14,
  },
  h6: {
    
    marginTop:12,
  },
  text_h1: {
    fontWeight: 'bold',
    fontSize: 24,
    fontFamily: FONT_FAMILY.heavy,
  },
  text_h2: {
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: FONT_FAMILY.heavy,
  },
  text_h3: {
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: FONT_FAMILY.heavy,
  },
  text_h4: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: FONT_FAMILY.heavy,
  },
  text_h5: {
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: FONT_FAMILY.heavy,
  },
  text_h6: {
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: FONT_FAMILY.heavy,
  },
  i: {
    
    fontStyle: 'italic',
    fontFamily: FONT_FAMILY.italic,
  },
  text_i: {
    
    fontStyle: 'italic',
    fontFamily: FONT_FAMILY.italic,
    fontSize: P_FONT_SIZE,
    lineHeight:20,
  },
  p: {
    padding:10,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  pre: {

  },
  strong: {
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.heavy,
    fontSize: P_FONT_SIZE,
    lineHeight:20,
  },
  text_strong: {
    fontWeight: 'bold',
    fontFamily: FONT_FAMILY.heavy,
    fontSize: P_FONT_SIZE,
    lineHeight:20,
  },
  q: {

  },
  span: {

  },
  sub: {

  },
  sup: {

  },
  ol:{
    marginLeft: 24,
  },
  ul: {
    marginLeft: 24,
  },
  text_p: {
    
    fontFamily: FONT_FAMILY.normal,
    fontSize: P_FONT_SIZE,
    lineHeight:20,
  },
  default: {
    fontFamily: FONT_FAMILY.normal,
    fontSize: 12,
  }
});

function isText(tagName) : Boolean {
  return tagName === "#text"
}

function isBlockElement(tagName) : Boolean {
  return BLOCK_ELEMENTS.indexOf(tagName) != -1
}

function isInlineElement(tagName) : Boolean {
  return INLINE_ELEMENTS.indexOf(tagName) != -1
}

function process(node, innerStyle){
  //console.log("log this: node",  node)
  index ++; 
  var componentType = (isInlineElement(node.nodeName) || isText(node.nodeName) ? "Text" : "View");
  var collectedComponents = [];
  var kids = []
  var href = "";

  if(node.nodeName == "a"){
    if(typeof node.attrs == "Array"){
      node.attrs.forEach((atts, ind) => {
        if(atts.name == "href" || typeof atts.value == "string"){
          href = atts.value; // need to process this and break it down to api call/newsView or WebView
        }
      })
    }
  }

  if(node.nodeName == "p"){
    var length = (typeof node.value != "undefined" ? node.value.length : false)
    if(length){
      if(length >= MAX_CHARS){
        var divide = parseInt(length)/ MAX_CHARS;
        var rows = Math.round(divide) - 1;
        var trailchars = length%MAX_CHARS;
        var mostText = node.value.slice(0, length - trailchars);
        var leastText = node.value.slice(trailchars * -1);
        //console.log("log this: stuff 1", divide, rows, trailchars, mostText, leastText)
        // remainder into its own view, flex = # of chars left
        //console.log("log this: textcomponrnt", `text_${parentType}`)
        if(trailchars == 0){
          console.log("log this: element at bat", tindex, "Text", node.value, `text_${node.parentNode.nodeName}`)
          tindex = index + "_noTrail"
          kids.push(<Text key={tindex} style={DEFAULT_STYLES[`text_${node.parentNode.nodeName}`]} numberOfLines={0}>{node.value}</Text>)
        }
        else{
          tindex = index + "_Lines"
          iindex = index + "_Trail"
          console.log("log this: element at bat", tindex, "Text", mostText, `text_${node.parentNode.nodeName}`)
          console.log("log this: element at bat", iindex, "Text", leastText, `text_${node.parentNode.nodeName}`)
          kids.push(<Text key={tindex} style={DEFAULT_STYLES[`text_${node.parentNode.nodeName}`]} numberOfLines={0}>{mostText}</Text>)
          kids.push(<Text key={iindex} style={[DEFAULT_STYLES[`text_${node.parentNode.nodeName}`], {flex: trailchars}]}>{leastText}</Text>)
        }
      }
      else{
        console.log("log this: element at bat", index+Math.random(), "Text", node.value, `text_${node.parentNode.nodeName}`)
        kids.push(<Text key={index+Math.random()} style={[DEFAULT_STYLES[`text_${node.parentNode.nodeName}`], {flex: length}]}>{node.value}</Text>)
      }
      if(typeof node.childNodes != "undefined" && node.childNodes.length > 0){
        node.childNodes.forEach((child, ind) => {
          collectedComponents.push(process(child, innerStyle)) 
        })
      }
      //console.log("log this: p": kids, collectedComponents)
      return(
        <Text key={index} style={DEFAULT_STYLES['p']}>
          {kids}
          {collectedComponents}
        </Text>
      )
    }
    else{

      if(typeof node.childNodes != "undefined" && node.childNodes.length > 0){
        node.childNodes.forEach((child, ind) => {
          collectedComponents.push(process(child, innerStyle)) 
        })
      }

      //console.log("log this: p w/o kids", index)
      return(
        <Text key={index} style={DEFAULT_STYLES['p']}>
          {collectedComponents}
        </Text>
      )
    }
  }

  if(node.nodeName == "#text"){
    var length = (typeof node.value != "undefined" ? node.value.length : false)
    if(length >= MAX_CHARS){
        var divide = parseInt(length)/ MAX_CHARS
        var rows = (Math.round(divide)<= 0 ? 1 : Math.round(divide));
        var trailchars = length%MAX_CHARS;
        var mostText = node.value.slice(0, length - trailchars);
        var leastText = node.value.slice(trailchars * -1);
        // remainder into its own view, flex = # of chars left
        //console.log("log this: textcomponrnt", `text_${parentType}`)
        if(trailchars == 0){
          console.log("log this: element at bat", index+Math.random(), "Text", node.value, `text_${node.parentNode.nodeName}`)
          kids.push(<Text key={index+Math.random()} style={DEFAULT_STYLES[`text_${node.parentNode.nodeName}`]} numberOfLines={0}>{node.value}</Text>)
        }
        else{
          console.log("log this: element at bat", `${index}_${node.nodeName}_1_${Math.random()}`, "Text", mostText, `text_${node.parentNode.nodeName}`)
          console.log("log this: element at bat", `${index}_${node.nodeName}_2_${Math.random()}`, "Text", leastText, `text_${node.parentNode.nodeName}`)
          kids.push(<Text key={`${index}_${node.nodeName}_1_${Math.random()}`} style={DEFAULT_STYLES[`text_${node.parentNode.nodeName}`]} numberOfLines={0}>{mostText}</Text>)
          kids.push(<Text key={`${index}_${node.nodeName}_2_${Math.random()}`} style={[DEFAULT_STYLES[`text_${node.parentNode.nodeName}`]]}>{leastText}</Text>)
        }
        //console.log("log this: stuff 2", MAX_CHARS)
    }
    else{
        //console.log("log this: printing", node.value)
        console.log("log this: element at bat", index+Math.random(), "Text", node.value, `text_${node.parentNode.nodeName}`)
        kids.push(<Text key={index+Math.random()} style={[DEFAULT_STYLES[`text_${node.parentNode.nodeName}`], {flex: length}]}>{node.value}</Text>)
    }
    //console.log("log this: #text": kids)
    return(
        <Text key={index} style={DEFAULT_STYLES['p']}>
          {kids}
        </Text>
    )

  }

  // if href, component becomes a button
  
  if(typeof node.childNodes != "undefined" && node.childNodes.length > 0){
    node.childNodes.forEach((child, index) => {
      //console.log("log this: not blank node", process(child, index))
      collectedComponents.push(process(child, index, node.nodeName)) 
    })

    if(componentType == "Text"){
      //console.log("log this: not blank return text", collectedComponents)
      return(
        <Text key={`${index}_${node.nodeName}_baseText_${Math.random()}`} style={DEFAULT_STYLES[node.nodeName]}>
          {collectedComponents}
        </Text>
      )
    }
    else if(componentType == "View"){
      //console.log("log this: not blank return view", collectedComponents)
      return(<View key={`${index}_${node.nodeName}_baseView_${Math.random()}`} style={DEFAULT_STYLES[node.nodeName]}>{collectedComponents}</View>)
    }
  }
  else{
    console.log("log this: blank return text", node, node.nodeName ,index, node.value)
    // should be the end of the line
    return(<Text key={`${index}_${node.nodeName}__${Math.random()}`} style={[DEFAULT_STYLES[`text_${node.parentNode.nodeName}`], {flex: length}]}>{node.value}</Text>)

  }

}

class HtmlText extends React.Component {
  parse(html) {
    //console.log("log this: in parse", html);
    var parser = new parse5.Parser()
    var fragment = parser.parseFragment(html)
    return fragment
  }


  render() {
    var html = this.props.html
    var passedStyle = (typeof this.props.innerStyle !== "undefined" ? this.props.innerStyle : false)
    var fragment = this.parse(html)

    var children = []
    fragment.childNodes.forEach((node, passedStyle) => {
      console.log("log this: node", node);
      // wrap the content in this element

      children.push(process(node))
    })

    console.log("log this: prepped", children);

    
    return (
      <View style={this.props.style}>
        {children}
      </View>
    )
  }
}

module.exports = HtmlText
