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

var MAX_CHARS = 42

var BLOCK_ELEMENTS = ["blockquote", "div", "hr", "ol", "pre", "ul", "li", "script", "p", "h1", "h2", "h3", "h4", "h5", "h6"]

var INLINE_ELEMENTS = ["b", "i", "em", "strong", "a", "br", "q", "span", "sub", "sup", "strong"]

var DEFAULT_STYLES = StyleSheet.create({
  a: {
    fontFamily: 'IowanOldStyle-Bold',
    color: '#329ce8',
  },
  b: {
    fontFamily: 'IowanOldStyle-Bold',
  },
  text_b: {
    fontFamily: 'IowanOldStyle-Bold',
  },
  strong: {
    fontFamily: 'IowanOldStyle-Bold',
  },
  text_strong: {
    fontFamily: 'IowanOldStyle-Bold',
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
    
    fontStyle: 'italic',
    fontFamily: 'IowanOldStyle-Italic',
  },
  text_em: {
    
    fontStyle: 'italic',
    fontFamily: 'IowanOldStyle-Italic',
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
    fontFamily: 'IowanOldStyle-Bold',
  },
  text_h2: {
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'IowanOldStyle-Bold',
  },
  text_h3: {
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'IowanOldStyle-Bold',
  },
  text_h4: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'IowanOldStyle-Bold',
  },
  text_h5: {
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'IowanOldStyle-Bold',
  },
  text_h6: {
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'IowanOldStyle-Bold',
  },
  i: {
    
    fontStyle: 'italic',
    fontFamily: 'IowanOldStyle-Italic',
  },
  text_i: {
    
    fontStyle: 'italic',
    fontFamily: 'IowanOldStyle-Italic',
    fontSize:14,
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
    fontFamily: 'IowanOldStyle-Bold',
    fontSize:14,
    lineHeight:20,
  },
  text_strong: {
    fontWeight: 'bold',
    fontFamily: 'IowanOldStyle-Bold',
    fontSize:14,
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
    
    fontFamily: 'IowanOldStyle-Roman',
    fontSize:14,
    lineHeight:20,
  },
  default: {

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

function process(node, index, parentName){

  index += "_"+node.nodeName; 
  var componentType = (isInlineElement(node.nodeName) || isText(node.nodeName) ? "Text" : "View");
  var collectedComponents = [];
  var kids = []
  var href = "";

  if(node.nodeName == "a"){
    if(typeof node.attrs == "Array"){
      node.attrs.forEach((atts, index) => {
        if(atts.name == "href" || typeof atts.value == "string"){
          href = atts.value; // need to process this and break it down to api call/newsView or WebView
        }
      })
    }
  }

  if(node.nodeName == "p"){
    var length = (typeof node.value != "undefined" ? node.value.length : false)


    if(length){
      if(length <= MAX_CHARS){
        var divide = parseInt(length)/ MAX_CHARS;
        var rows = Math.round(divide) - 1;
        var trailchars = length%MAX_CHARS;
        var mostText = node.value.slice(0, length - trailchars);
        var leastText = node.value.slice(trailchars * -1);
        // remainder into its own view, flex = # of chars left
        //console.log("log this: textcomponrnt", `text_${parentType}`)
        if(trailchars == 0){
          kids.push(<Text key={`${index}_${node.nodeName}`} style={DEFAULT_STYLES[`text_${node.parentNode.type}`]} numberOfLines={rows}>{node.value}</Text>)
        }
        else{
          kids.push(<Text key={`${index}_${node.nodeName}`} style={DEFAULT_STYLES[`text_${node.parentNode.type}`]} numberOfLines={rows}>{node.value}</Text>)
          kids.push(<Text key={`${index}_${node.nodeName}`} style={[DEFAULT_STYLES[`text_${node.parentNode.type}`], {flex: trailchars}]}>{node.value}</Text>)
        }
      }
      else{
        kids.push(<Text key={`${index}_${node.nodeName}`} style={[DEFAULT_STYLES[`text_${node.parentNode.type}`], {flex: length}]}>{node.value}</Text>)
      }
      if(typeof node.childNodes != "undefined" && node.childNodes.length > 0){
        node.childNodes.forEach((child, index) => {
          collectedComponents.push(process(child, index, node.nodeName)) 
        })
      }
      console.log("log this: p": kids, collectedComponents)
      return(
        <Text style={DEFAULT_STYLES['p']}>
          {kids}
          {collectedComponents}
        </Text>
      )
    }
    else{

      if(typeof node.childNodes != "undefined" && node.childNodes.length > 0){
        node.childNodes.forEach((child, index) => {
          collectedComponents.push(process(child, index, node.nodeName)) 
        })
      }
      console.log("log this: p w/o kids": collectedComponents)
      return(
        <Text style={DEFAULT_STYLES['p']}>
          {collectedComponents}
        </Text>
      )
    }
  }

  if(node.nodeName == "#text"){
    var length = (typeof node.value != "undefined" ? node.value.length : false)
    if(length <= MAX_CHARS){
        var divide = parseInt(length)/ MAX_CHARS
        var rows = Math.round(divide) - 1;
        var trailchars = length%MAX_CHARS;
        var mostText = node.value.slice(0, length - trailchars);
        var leastText = node.value.slice(trailchars * -1);
        // remainder into its own view, flex = # of chars left
        //console.log("log this: textcomponrnt", `text_${parentType}`)
        if(trailchars == 0){
          kids.push(<Text key={`${index}_${node.nodeName}`} style={DEFAULT_STYLES[`text_${node.parentNode.type}`]} numberOfLines={rows}>{node.value}</Text>)
        }
        else{
          kids.push(<Text key={`${index}_${node.nodeName}`} style={DEFAULT_STYLES[`text_${node.parentNode.type}`]} numberOfLines={rows}>{node.value}</Text>)
          kids.push(<Text key={`${index}_${node.nodeName}`} style={[DEFAULT_STYLES[`text_${node.parentNode.type}`], {flex: trailchars}]}>{node.value}</Text>)
        }
    }
    else{
        kids.push(<Text key={`${index}_${node.nodeName}`} style={[DEFAULT_STYLES[`text_${node.parentNode.type}`], {flex: length}]}>{node.value}</Text>)
    }
    console.log("log this: #text": kids)
    return(
        <Text style={DEFAULT_STYLES['p']}>
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
        <Text key={index} style={DEFAULT_STYLES[node.nodeName]}>
          {collectedComponents}
        </Text>
      )
    }
    else if(componentType == "View"){
      //console.log("log this: not blank return view", collectedComponents)
      return(<View key={index} style={DEFAULT_STYLES[node.nodeName]}>{collectedComponents}</View>)
    }
  }
  else{
    //console.log("log this: blank return text", textComponent(node, node.nodeName ,index))
    // should be the end of the line
    return(<Text key={index} style={[DEFAULT_STYLES[`text_${node.parentNode.type}`], {flex: length}]}>{node.value}</Text>)

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
    var fragment = this.parse(html)

    var children = []
    fragment.childNodes.forEach((node, index) => {
      console.log("log this: node", node);
      // wrap the content in this element

      children.push(process(node, index))
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
