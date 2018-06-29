---
title: Search Queries
weight: 22
product: "Uchiwa"
version: "1.0"
menu:
  uchiwa-1.0:
    parent: guides
---

## Queries
The most basic query is composed of a `value` but can also contains a *field*
and its *value*, in the form of `field:value`. When only specifying the *value*,
all fields are tested against it.

A query can use any field, visible or not, to match a value, such as:

- `us-west-1`
- `dc:us-west-1`
- `subscriber:rabbitmq`
- `subscription:linux`
- `team:webops`

## Regular Expressions
Javascript's *RegExp* object is used to retrieve the matches, thus the following
special characters are available to use exclusively with `field:value` queries.

`.` - Matches any single character.
For example, `dc:a.stria` matches the datacenter **austria**.

`*` - Matches the preceding character 0 or more times.
For example, `dc:can*` matches the datacenters **canada** and **vatican**, but
not **cameroon**.

`+` - Matches the preceding character 1 or more times.
For example, `dc:ira+` matches the datacenters **iran** and **iraq**, but not
**ireland**.

`?` - Matches the preceding character 0 or 1 time.
For example, `dc:oc?o` matches the datacenter **cameroon**, but not **morocco**.

`^` - Matches beginning of input.
For example, `dc:^por` matches the datacenter **portgual**, but not
**singapore**.

`$` - Matches end of input.
For example, `dc:nea$` matches the datacenter **guinea**, but not
**guinea-bissau**.

### Negative Lookahead
`^((?!string).)*$` - Does not match the provided *string*.

For example, `check:^((?!check_critical).)*$` does not match the check
**check_critical** but does match **check_warning**.

Also, `client:^((?!foo).)*$` does not match the client
**foo** but does match **bar**.

When using negative lookahead, the field name must be unique within the
object. The **check** and **client** field names can be used for this reason
instead of **name**.

See the [RegExp Object](http://www.w3schools.com/jsref/jsref_obj_regexp.asp)
documentation for possible quantifiers.