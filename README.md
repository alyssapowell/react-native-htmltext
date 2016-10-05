# react-native-htmltext

WIP: Experiment to use HTML like markup to create stylized text in react-native.

## Why?

React Native provide a Text element for stylized text. Instead of using ``NSAttributedString``, 
you creat nested Text:

```
<Text style={{fontWeight: 'bold'}}>
  I am bold 
  <Text style={{color: 'red'}}> and red </Text>
</Text>
```

While this approach is excellent for static interface text, what if we have dynamic text with format we 
do not know until we use it? ``HtmlText`` is a component to present a limited subset of HTML as
React Native views.

**Important**: This is not going to replace your ``WebView`` for HTML rendering, instead it use a
limited subset of HTML and try to present it using native ``Text`` elements in a reasonable way.

## Example 

### Input

```javascript
render: function() {
  var html = `<p>Hello world <b>world</b> <i>foo</i> bar hahh</p>`
  return (
    <View style={styles.container}>
      <HtmlText style={styles.welcome} html={html}></HtmlText>
    </View>
  );
}
```
<img src="https://raw.githubusercontent.com/siuying/react-native-htmltext/master/example1.png" />

### Input 

```javascript
render: function() {
  var html = `<blockquote><p>Hello world <b>world</b> <i>foo</i> <blockquote>bar hahh</blockquote></p></blockquote>`
  return (
    <View style={styles.container}>
      <HtmlText style={styles.welcome} html={html}></HtmlText>
    </View>
  );
}
```


<img src="https://raw.githubusercontent.com/siuying/react-native-htmltext/master/example2.png" />

### Installation

Ignore npm -- it managed to completely screw my installation up, and this project is lightweight enough that it's not necessary.  Just create a /lib folder at the root of your project (if you don't already have one) and copy /lib/HtmlText.js in there.

The file requires the additional dependency of parse5.  Your package.json file should look something like this:
```
{
  "name": "TDMNApp2",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "start": "node node_modules/react-native/local-cli/cli.js start"
  },
  "dependencies": {
    "react": "15.3.2",
    "parse5": "^1.4.1",
    "react-native": "0.34.1"
  }
}
```
Close your emulator and react Packager windows, then run ``npm update`` (or ``sudo npm update``, if necessary) in the root of your project.

parse5 should install.  You now have everything you need to make this feature work.

### Usage

include the js file in the view file where you'll need to include an HtmlText element (instead of a Text element)

```
var React = require('react');
var ReactNative = require('react-native');
var {
  Image,
  ScrollView,
  ActivityIndicator,
  ListView,
  Platform,
  StyleSheet,
  Text,
  View,
} = ReactNative;

var HtmlText = require('./lib/HtmlText');
```

Use the component like so:
```
<HtmlText style={styles.innerImageCaption} html={image.images[0].caption}></HtmlText>
```

The HtmlText element may be nested and used just like any other component.
```
<View style={styles.innerImageView}>
   <Image
      source={{uri: uri}}
      style={styles.innerImage}
   />
   <HtmlText style={styles.innerImageCaption} html={image.images[0].caption}></HtmlText>        
</View>
```
Note that unlike the text component,  the HtmlText component must have an html property, and that property must be set equal to the HTML data you want to parse out.
